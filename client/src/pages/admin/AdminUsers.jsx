import { useState, useEffect } from 'react';
import { Shield, User } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const ROLES = ['customer', 'staff', 'admin'];

const getRoleColor = (role) => {
  switch (role) {
    case 'admin': return 'bg-primary/10 text-primary border-primary/20';
    case 'staff': return 'bg-info/10 text-info border-info/20';
    default: return 'bg-surface-variant text-on-surface border-outline';
  }
};

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get('/admin/users');
        setUsers(data.data);
      } catch (err) {
        toast.error('Failed to load users');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingId(userId);
    try {
      const { data } = await api.put(`/admin/users/${userId}/role`, { role: newRole });
      setUsers(prev => prev.map(u => u._id === userId ? data.data : u));
      toast.success('Role updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update role');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-extrabold text-on-surface">User Management</h1>
        <p className="text-on-surface-variant">Manage customer and staff roles.</p>
      </div>

      <div className="bg-surface rounded-card border border-outline overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-surface-variant border-b border-outline">
            <tr className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              <th className="p-4">User</th>
              <th className="p-4">Email</th>
              <th className="p-4">Joined</th>
              <th className="p-4">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline">
            {isLoading ? (
              <tr><td colSpan="4" className="p-8 text-center text-on-surface-variant">Loading users...</td></tr>
            ) : users.map(user => (
              <tr key={user._id} className="hover:bg-surface-variant/30 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                      {user.firstName?.[0]?.toUpperCase()}{user.lastName?.[0]?.toUpperCase()}
                    </div>
                    <span className="font-bold text-sm">{user.firstName} {user.lastName}</span>
                  </div>
                </td>
                <td className="p-4 text-sm text-on-surface-variant">{user.email}</td>
                <td className="p-4 text-sm text-on-surface-variant">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full border ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                    <div className="relative">
                      <Shield size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                      <select
                        className="pl-7 pr-3 py-1.5 bg-surface-variant text-sm border border-outline rounded-md focus:ring-1 focus:ring-primary cursor-pointer appearance-none"
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        disabled={updatingId === user._id}
                      >
                        {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
