'use client';

import { useState } from 'react';
import { Users, Plus, Edit, Trash2, Shield, CheckCircle, XCircle } from 'lucide-react';
import { db } from '@/lib/db';
import { format } from 'date-fns';

export default function UserManagement() {
  const users = db.getAllUsers();

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-purple-100 text-purple-800';
      case 'Manager':
        return 'bg-blue-100 text-blue-800';
      case 'Reviewer':
        return 'bg-green-100 text-green-800';
      case 'Author':
        return 'bg-yellow-100 text-yellow-800';
      case 'Viewer':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
          <p className="text-sm text-gray-600 mt-1">Manage users and role-based access control</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          <Plus className="h-5 w-5" />
          <span>Add User</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Total Users</p>
          <p className="text-2xl font-bold text-gray-900">{users.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Active Users</p>
          <p className="text-2xl font-bold text-green-600">{users.filter(u => u.isActive).length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Admins</p>
          <p className="text-2xl font-bold text-purple-600">{users.filter(u => u.role === 'Admin').length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Managers</p>
          <p className="text-2xl font-bold text-blue-600">{users.filter(u => u.role === 'Manager').length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Reviewers</p>
          <p className="text-2xl font-bold text-green-600">{users.filter(u => u.role === 'Reviewer').length}</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-primary-700 font-semibold text-sm">
                          {user.fullName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        <div className="text-xs text-gray-400">@{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.isActive ? (
                      <span className="flex items-center text-green-600 text-sm">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Active
                      </span>
                    ) : (
                      <span className="flex items-center text-red-600 text-sm">
                        <XCircle className="h-4 w-4 mr-1" />
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLogin ? format(new Date(user.lastLogin), 'MMM dd, yyyy') : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <button className="text-primary-600 hover:text-primary-800" title="Edit">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-800" title="Permissions">
                        <Shield className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permissions Overview */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Role Permissions Matrix</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Create
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Read
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Update
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Delete
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Approve
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sign
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Admin</td>
                <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-600 mx-auto" /></td>
                <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-600 mx-auto" /></td>
                <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-600 mx-auto" /></td>
                <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-600 mx-auto" /></td>
                <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-600 mx-auto" /></td>
                <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-600 mx-auto" /></td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Manager</td>
                <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-600 mx-auto" /></td>
                <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-600 mx-auto" /></td>
                <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-600 mx-auto" /></td>
                <td className="px-6 py-4 text-center"><XCircle className="h-5 w-5 text-gray-300 mx-auto" /></td>
                <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-600 mx-auto" /></td>
                <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-600 mx-auto" /></td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Reviewer</td>
                <td className="px-6 py-4 text-center"><XCircle className="h-5 w-5 text-gray-300 mx-auto" /></td>
                <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-600 mx-auto" /></td>
                <td className="px-6 py-4 text-center"><XCircle className="h-5 w-5 text-gray-300 mx-auto" /></td>
                <td className="px-6 py-4 text-center"><XCircle className="h-5 w-5 text-gray-300 mx-auto" /></td>
                <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-600 mx-auto" /></td>
                <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-600 mx-auto" /></td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Author</td>
                <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-600 mx-auto" /></td>
                <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-600 mx-auto" /></td>
                <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-600 mx-auto" /></td>
                <td className="px-6 py-4 text-center"><XCircle className="h-5 w-5 text-gray-300 mx-auto" /></td>
                <td className="px-6 py-4 text-center"><XCircle className="h-5 w-5 text-gray-300 mx-auto" /></td>
                <td className="px-6 py-4 text-center"><XCircle className="h-5 w-5 text-gray-300 mx-auto" /></td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Viewer</td>
                <td className="px-6 py-4 text-center"><XCircle className="h-5 w-5 text-gray-300 mx-auto" /></td>
                <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-600 mx-auto" /></td>
                <td className="px-6 py-4 text-center"><XCircle className="h-5 w-5 text-gray-300 mx-auto" /></td>
                <td className="px-6 py-4 text-center"><XCircle className="h-5 w-5 text-gray-300 mx-auto" /></td>
                <td className="px-6 py-4 text-center"><XCircle className="h-5 w-5 text-gray-300 mx-auto" /></td>
                <td className="px-6 py-4 text-center"><XCircle className="h-5 w-5 text-gray-300 mx-auto" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
