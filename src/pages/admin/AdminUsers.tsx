import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockUsers, mockBookings } from "@/data/mockData";

const roleColor: Record<string, string> = { admin: "bg-primary text-primary-foreground", customer: "bg-secondary text-secondary-foreground" };

export default function AdminUsers() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-foreground">Users</h1>
      <Card className="border-border/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Role</TableHead><TableHead>Phone</TableHead><TableHead>Bookings</TableHead><TableHead>Joined</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {mockUsers.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell className="text-sm">{u.email}</TableCell>
                  <TableCell><Badge className={roleColor[u.role] ?? ""}>{u.role}</Badge></TableCell>
                  <TableCell className="text-sm">{u.phone ?? "—"}</TableCell>
                  <TableCell>{mockBookings.filter((b) => b.userId === u.id).length}</TableCell>
                  <TableCell className="text-sm">{u.createdAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
