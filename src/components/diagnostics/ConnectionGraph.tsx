import { useCallback, useMemo, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type NodeTypes,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useConnectionGraph } from '@/hooks/useDiagnostics';
import type { AssetType, GraphFilters } from '@/types/diagnostic';
import { ASSET_TYPE_LABELS } from '@/types/diagnostic';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus, Monitor, Briefcase, UserCircle, FileText, Radio } from 'lucide-react';
import { NodeDetailPanel } from './NodeDetailPanel';
import { AddLinkDialog } from './AddLinkDialog';

const ASSET_COLORS: Record<AssetType, string> = {
  AD_ACCOUNT: 'hsl(215, 70%, 55%)',
  BUSINESS_MANAGER: 'hsl(270, 60%, 60%)',
  PROFILE: 'hsl(152, 56%, 46%)',
  PAGE: 'hsl(25, 95%, 53%)',
  PIXEL: 'hsl(0, 72%, 51%)',
};

const ASSET_ICONS: Record<AssetType, typeof Monitor> = {
  AD_ACCOUNT: Monitor,
  BUSINESS_MANAGER: Briefcase,
  PROFILE: UserCircle,
  PAGE: FileText,
  PIXEL: Radio,
};

const STATUS_BORDER: Record<string, string> = {
  ACTIVE: '3px solid hsl(152, 56%, 46%)',
  DISABLED: '3px solid hsl(0, 0%, 55%)',
  BLOCKED: '3px solid hsl(0, 72%, 51%)',
  ROLLBACK: '3px solid hsl(38, 92%, 50%)',
};

function AssetNode({ data }: { data: { label: string; assetType: AssetType; status: string } }) {
  const Icon = ASSET_ICONS[data.assetType];
  const color = ASSET_COLORS[data.assetType];
  return (
    <div
      className="bg-card rounded-lg px-4 py-3 min-w-[160px] shadow-md"
      style={{ border: STATUS_BORDER[data.status] || '3px solid hsl(0,0%,16%)' }}
    >
      <Handle type="target" position={Position.Top} className="!bg-muted-foreground" />
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 shrink-0" style={{ color }} />
        <div className="min-w-0">
          <p className="text-xs font-medium text-foreground truncate">{data.label}</p>
          <p className="text-[10px] text-muted-foreground">{ASSET_TYPE_LABELS[data.assetType]}</p>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-muted-foreground" />
    </div>
  );
}

const nodeTypes: NodeTypes = { asset: AssetNode as any };

export function ConnectionGraph() {
  const [filters, setFilters] = useState<GraphFilters>({});
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);

  const { data: graphData } = useConnectionGraph(filters);

  const initialNodes: Node[] = useMemo(() => {
    if (!graphData) return [];
    const cols = 4;
    return graphData.nodes.map((n, i) => ({
      id: n.id,
      type: 'asset',
      position: { x: (i % cols) * 250 + 50, y: Math.floor(i / cols) * 150 + 50 },
      data: { label: n.name, assetType: n.type, status: n.status },
    }));
  }, [graphData]);

  const initialEdges: Edge[] = useMemo(() => {
    if (!graphData) return [];
    return graphData.links.map(l => ({
      id: l.id,
      source: l.sourceId,
      target: l.targetId,
      label: l.relationship,
      animated: true,
      style: { stroke: 'hsl(0,0%,40%)' },
      labelStyle: { fill: 'hsl(0,0%,70%)', fontSize: 10 },
    }));
  }, [graphData]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Keep in sync with data
  useMemo(() => { setNodes(initialNodes); }, [initialNodes]);
  useMemo(() => { setEdges(initialEdges); }, [initialEdges]);

  const onNodeClick = useCallback((_: any, node: Node) => setSelectedNodeId(node.id), []);

  return (
    <div className="flex flex-col gap-4 h-[calc(100vh-16rem)]">
      <div className="flex items-center gap-3 flex-wrap">
        <Select value={filters.assetType || 'ALL'} onValueChange={v => setFilters(f => ({ ...f, assetType: v === 'ALL' ? undefined : v }))}>
          <SelectTrigger className="w-[200px] h-9"><SelectValue placeholder="Tipo de ativo" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos os tipos</SelectItem>
            {Object.entries(ASSET_TYPE_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button size="sm" onClick={() => setLinkDialogOpen(true)}><Plus className="h-4 w-4 mr-1" /> Nova Conexão</Button>
      </div>

      <div className="flex-1 rounded-lg border border-border overflow-hidden bg-surface-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          proOptions={{ hideAttribution: true }}
        >
          <Background color="hsl(0,0%,20%)" gap={20} />
          <Controls className="!bg-card !border-border [&>button]:!bg-card [&>button]:!border-border [&>button]:!text-foreground" />
          <MiniMap
            nodeColor={n => ASSET_COLORS[(n.data as any)?.assetType as AssetType] || '#666'}
            className="!bg-surface-2 !border-border"
          />
        </ReactFlow>
      </div>

      {selectedNodeId && (
        <NodeDetailPanel
          nodeId={selectedNodeId}
          onClose={() => setSelectedNodeId(null)}
        />
      )}

      <AddLinkDialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen} />
    </div>
  );
}

