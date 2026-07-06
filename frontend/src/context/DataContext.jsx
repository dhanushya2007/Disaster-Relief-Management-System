import React, { createContext, useContext, useState } from 'react';
import {
  MOCK_DISASTERS, MOCK_RESOURCES, MOCK_REQUESTS,
  MOCK_DISTRIBUTION, MOCK_AUDIT_LOGS
} from '../mockData';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [disasters, setDisasters] = useState([...MOCK_DISASTERS]);
  const [resources, setResources] = useState([...MOCK_RESOURCES]);
  const [requests, setRequests] = useState([...MOCK_REQUESTS]);
  const [distribution, setDistribution] = useState([...MOCK_DISTRIBUTION]);
  const [auditLogs, setAuditLogs] = useState([...MOCK_AUDIT_LOGS]);
  const [notifications, setNotifications] = useState([]);

  const addLog = (admin, action, entityType, entityId, details) => {
    const log = { id: Date.now(), admin, action, entityType, entityId, timestamp: new Date().toISOString(), details };
    setAuditLogs(prev => [log, ...prev]);
  };

  const addNotification = (msg, type = 'info') => {
    setNotifications(prev => [{ id: Date.now(), msg, type, time: new Date() }, ...prev]);
  };

  // ─── Disasters ────────────────────────────────────────────────────────────
  const addDisaster = (data) => {
    const d = { id: Date.now(), ...data };
    setDisasters(prev => [d, ...prev]);
    addLog('Admin User', 'CREATE_DISASTER', 'Disaster', d.id, `Created disaster: ${d.name}`);
    return d;
  };
  const updateDisaster = (id, data) => {
    setDisasters(prev => prev.map(d => d.id === id ? { ...d, ...data } : d));
    addLog('Admin User', 'UPDATE_DISASTER', 'Disaster', id, `Updated disaster ID ${id}`);
  };
  const deleteDisaster = (id) => {
    setDisasters(prev => prev.filter(d => d.id !== id));
    addLog('Admin User', 'DELETE_DISASTER', 'Disaster', id, `Deleted disaster ID ${id}`);
  };

  // ─── Resources ────────────────────────────────────────────────────────────
  const addResource = (data) => {
    const r = { id: Date.now(), ...data, lastUpdated: new Date().toISOString().split('T')[0] };
    setResources(prev => [r, ...prev]);
    addLog('Admin User', 'CREATE_RESOURCE', 'Resource', r.id, `Added resource: ${r.name}`);
    return r;
  };
  const updateResource = (id, data) => {
    setResources(prev => prev.map(r => r.id === id ? { ...r, ...data, lastUpdated: new Date().toISOString().split('T')[0] } : r));
    addLog('Admin User', 'UPDATE_RESOURCE', 'Resource', id, `Updated resource ID ${id}`);
  };
  const deleteResource = (id) => {
    setResources(prev => prev.filter(r => r.id !== id));
    addLog('Admin User', 'DELETE_RESOURCE', 'Resource', id, `Deleted resource ID ${id}`);
  };

  // ─── Requests ─────────────────────────────────────────────────────────────
  const submitRequest = (data, user) => {
    const req = {
      id: Date.now(),
      userId: user.id,
      userName: user.name,
      phone: user.phone || '',
      ...data,
      status: 'PENDING',
      createdAt: new Date().toISOString().split('T')[0],
      allocatedResources: '',
    };
    setRequests(prev => [req, ...prev]);
    addNotification(`New relief request from ${user.name}`, 'info');
    return req;
  };

  const updateRequestStatus = (id, status, adminName, allocatedResources) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status, allocatedResources: allocatedResources || r.allocatedResources } : r));
    addLog(adminName, `${status}_REQUEST`, 'ReliefRequest', id, `Status updated to ${status}`);
    addNotification(`Request #${id} status changed to ${status}`, status === 'APPROVED' ? 'success' : 'info');
  };

  // ─── Distribution ─────────────────────────────────────────────────────────
  const distributeResource = (data) => {
    const dist = { id: Date.now(), ...data, distributionDate: new Date().toISOString().split('T')[0] };
    setDistribution(prev => [dist, ...prev]);
    // Reduce available stock
    setResources(prev => prev.map(r =>
      r.id === data.resourceId ? { ...r, availableStock: Math.max(0, r.availableStock - data.quantity), lastUpdated: new Date().toISOString().split('T')[0] } : r
    ));
    addLog('Admin User', 'DISTRIBUTE_RESOURCE', 'Distribution', dist.id, `Distributed ${data.quantity} of ${data.resourceName}`);
    return dist;
  };

  const getAdminStats = () => {
    const activeDisasters = disasters.filter(d => d.status === 'ACTIVE').length;
    const totalRequests = requests.length;
    const pendingRequests = requests.filter(r => r.status === 'PENDING').length;
    const completedRequests = requests.filter(r => r.status === 'COMPLETED').length;
    const totalStock = resources.reduce((s, r) => s + r.quantity, 0);
    const availableStock = resources.reduce((s, r) => s + r.availableStock, 0);
    const distributedStock = totalStock - availableStock;
    const lowStockResources = resources.filter(r => r.availableStock / r.quantity < 0.2);
    return { activeDisasters, totalDisasters: disasters.length, totalRequests, pendingRequests, completedRequests, totalStock, availableStock, distributedStock, lowStockResources };
  };

  return (
    <DataContext.Provider value={{
      disasters, resources, requests, distribution, auditLogs, notifications,
      addDisaster, updateDisaster, deleteDisaster,
      addResource, updateResource, deleteResource,
      submitRequest, updateRequestStatus,
      distributeResource,
      getAdminStats,
      addNotification,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
