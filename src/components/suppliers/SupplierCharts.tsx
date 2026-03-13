import { useSupplierStats } from '@/hooks/useSuppliers';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = [
  'hsl(152, 56%, 46%)', 'hsl(215, 70%, 55%)', 'hsl(38, 92%, 50%)',
  'hsl(270, 60%, 60%)', 'hsl(0, 72%, 51%)', 'hsl(25, 95%, 53%)',
];

export function SupplierCharts() {
  const { data: suppliers } = useSupplierStats();
  if (!suppliers) return null;

  const accountsData = suppliers.filter((s) => (s.totalAccounts ?? 0) > 0).map((s) => ({ name: s.name, value: s.totalAccounts ?? 0 }));
  const profilesData = suppliers.filter((s) => (s.totalProfiles ?? 0) > 0).map((s) => ({ name: s.name, value: s.totalProfiles ?? 0 }));
  const totalData = suppliers.map((s) => ({
    name: s.name,
    value: (s.totalAccounts ?? 0) + (s.totalProfiles ?? 0) + (s.totalBMs ?? 0) + (s.totalPages ?? 0) + (s.totalPixels ?? 0),
  })).filter((d) => d.value > 0);

  const tooltipStyle = { contentStyle: { background: 'hsl(0 0% 9%)', border: '1px solid hsl(0 0% 16%)', borderRadius: '8px', color: 'hsl(0 0% 90%)' } };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-6 border-border">
        <h3 className="text-foreground font-semibold mb-4">Contas por Fornecedor</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={accountsData}>
            <XAxis dataKey="name" tick={{ fill: 'hsl(0 0% 55%)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'hsl(0 0% 55%)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip {...tooltipStyle} />
            <Bar dataKey="value" fill="hsl(215, 70%, 55%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6 border-border">
        <h3 className="text-foreground font-semibold mb-4">Perfis por Fornecedor</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={profilesData}>
            <XAxis dataKey="name" tick={{ fill: 'hsl(0 0% 55%)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'hsl(0 0% 55%)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip {...tooltipStyle} />
            <Bar dataKey="value" fill="hsl(152, 56%, 46%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6 border-border lg:col-span-2">
        <h3 className="text-foreground font-semibold mb-4">Proporção de Ativos por Fornecedor</h3>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie data={totalData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} innerRadius={60} paddingAngle={2}>
              {totalData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip {...tooltipStyle} />
            <Legend wrapperStyle={{ color: 'hsl(0 0% 55%)', fontSize: '13px' }} />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
