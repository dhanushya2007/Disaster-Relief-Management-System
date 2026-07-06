// ─── Mock Data ────────────────────────────────────────────────────────────────
// This simulates API responses until the Spring Boot backend is wired up.

export const MOCK_USERS = [
  { id: 1, name: 'Admin User', email: 'admin@relieftrack.com', password: 'admin123', role: 'ADMIN', phone: '9876543210' },
  { id: 2, name: 'Rajesh Kumar', email: 'rajesh@email.com', password: 'user123', role: 'CITIZEN', phone: '9876543211' },
  { id: 3, name: 'Priya Sharma', email: 'priya@email.com', password: 'user123', role: 'CITIZEN', phone: '9876543212' },
  { id: 4, name: 'Arun Verma', email: 'arun@email.com', password: 'user123', role: 'CITIZEN', phone: '9876543213' },
  { id: 5, name: 'Sunita Devi', email: 'sunita@email.com', password: 'user123', role: 'CITIZEN', phone: '9876543214' },
];

export const MOCK_DISASTERS = [
  { id: 1, name: 'Kerala Floods 2024', type: 'Flood', location: 'Kerala, India', date: '2024-06-15', severity: 'HIGH', description: 'Severe flooding across multiple districts due to heavy monsoon rains. Over 50,000 people displaced.', status: 'ACTIVE' },
  { id: 2, name: 'Odisha Cyclone Remal', type: 'Cyclone', location: 'Odisha, India', date: '2024-05-27', severity: 'CRITICAL', description: 'Cyclone Remal made landfall causing widespread destruction. Category 3 cyclone.', status: 'ACTIVE' },
  { id: 3, name: 'Uttarakhand Landslide', type: 'Landslide', location: 'Uttarakhand, India', date: '2024-08-02', severity: 'HIGH', description: 'Multiple landslides triggered by heavy rainfall blocked highways and isolated villages.', status: 'ACTIVE' },
  { id: 4, name: 'Gujarat Earthquake', type: 'Earthquake', location: 'Gujarat, India', date: '2024-03-10', severity: 'MEDIUM', description: 'Magnitude 5.2 earthquake caused structural damage to buildings in several towns.', status: 'RESOLVED' },
  { id: 5, name: 'Tamil Nadu Drought', type: 'Drought', location: 'Tamil Nadu, India', date: '2024-04-01', severity: 'MEDIUM', description: 'Severe water scarcity affecting agriculture and drinking water in rural areas.', status: 'ACTIVE' },
  { id: 6, name: 'Mumbai Floods', type: 'Flood', location: 'Mumbai, Maharashtra', date: '2024-07-10', severity: 'HIGH', description: 'Record rainfall caused severe urban flooding, disrupting transport and power supply.', status: 'RESOLVED' },
  { id: 7, name: 'Assam River Flooding', type: 'Flood', location: 'Assam, India', date: '2024-07-20', severity: 'CRITICAL', description: 'Brahmaputra river overflow flooded over 30 districts displacing millions.', status: 'ACTIVE' },
  { id: 8, name: 'Himachal Pradesh Snowstorm', type: 'Snowstorm', location: 'Himachal Pradesh, India', date: '2024-01-15', severity: 'LOW', description: 'Heavy snowfall cut off mountain villages for several days.', status: 'RESOLVED' },
];

export const MOCK_RESOURCES = [
  { id: 1, name: 'Rice (50kg bags)', category: 'Food', quantity: 500, availableStock: 320, lastUpdated: '2024-07-05' },
  { id: 2, name: 'Wheat Flour (25kg)', category: 'Food', quantity: 300, availableStock: 180, lastUpdated: '2024-07-04' },
  { id: 3, name: 'Drinking Water (20L)', category: 'Water', quantity: 2000, availableStock: 1400, lastUpdated: '2024-07-06' },
  { id: 4, name: 'ORS Sachets', category: 'Water', quantity: 5000, availableStock: 850, lastUpdated: '2024-07-05' },
  { id: 5, name: 'Paracetamol Tablets', category: 'Medicines', quantity: 10000, availableStock: 7200, lastUpdated: '2024-07-03' },
  { id: 6, name: 'Antibiotics Course', category: 'Medicines', quantity: 2000, availableStock: 300, lastUpdated: '2024-07-02' },
  { id: 7, name: 'Medical First Aid Kit', category: 'Medical Kits', quantity: 300, availableStock: 210, lastUpdated: '2024-07-06' },
  { id: 8, name: 'Woolen Blankets', category: 'Blankets', quantity: 1500, availableStock: 980, lastUpdated: '2024-07-05' },
  { id: 9, name: 'Emergency Tents (Family)', category: 'Tents', quantity: 400, availableStock: 55, lastUpdated: '2024-07-04' },
  { id: 10, name: 'Tarpaulin Sheets', category: 'Tents', quantity: 800, availableStock: 600, lastUpdated: '2024-07-06' },
  { id: 11, name: "Children's Clothes (Assorted)", category: 'Clothes', quantity: 2000, availableStock: 1100, lastUpdated: '2024-07-03' },
  { id: 12, name: "Adult Clothes (Assorted)", category: 'Clothes', quantity: 3000, availableStock: 2400, lastUpdated: '2024-07-05' },
  { id: 13, name: 'Cooking Oil (5L)', category: 'Food', quantity: 400, availableStock: 60, lastUpdated: '2024-07-04' },
  { id: 14, name: 'Candles & Matches', category: 'Medical Kits', quantity: 5000, availableStock: 4200, lastUpdated: '2024-07-02' },
  { id: 15, name: 'Life Jackets', category: 'Medical Kits', quantity: 200, availableStock: 180, lastUpdated: '2024-07-01' },
];

export const MOCK_REQUESTS = [
  { id: 1, userId: 2, userName: 'Rajesh Kumar', phone: '9876543211', disasterId: 1, disasterName: 'Kerala Floods 2024', location: 'Thrissur, Kerala', familyMembers: 5, resourcesNeeded: 'Food, Water, Blankets', priority: 'HIGH', status: 'APPROVED', notes: 'Two elderly members need medicines', createdAt: '2024-07-01', allocatedResources: 'Rice x5, Water x10' },
  { id: 2, userId: 3, userName: 'Priya Sharma', phone: '9876543212', disasterId: 2, disasterName: 'Odisha Cyclone Remal', location: 'Bhubaneswar, Odisha', familyMembers: 3, resourcesNeeded: 'Food, Tent, Medicines', priority: 'CRITICAL', status: 'IN_PROGRESS', notes: 'House completely damaged, need shelter urgently', createdAt: '2024-07-02', allocatedResources: 'Tent x1, Rice x3' },
  { id: 3, userId: 4, userName: 'Arun Verma', phone: '9876543213', disasterId: 3, disasterName: 'Uttarakhand Landslide', location: 'Chamoli, Uttarakhand', familyMembers: 7, resourcesNeeded: 'Food, Water, Clothes', priority: 'HIGH', status: 'PENDING', notes: 'Village cut off from supplies', createdAt: '2024-07-03', allocatedResources: '' },
  { id: 4, userId: 5, userName: 'Sunita Devi', phone: '9876543214', disasterId: 7, disasterName: 'Assam River Flooding', location: 'Guwahati, Assam', familyMembers: 4, resourcesNeeded: 'Water, Medicines', priority: 'MEDIUM', status: 'COMPLETED', notes: 'Need clean drinking water urgently', createdAt: '2024-06-25', allocatedResources: 'ORS x20, Water x8' },
  { id: 5, userId: 2, userName: 'Rajesh Kumar', phone: '9876543211', disasterId: 7, disasterName: 'Assam River Flooding', location: 'Jorhat, Assam', familyMembers: 2, resourcesNeeded: 'Food, Blankets', priority: 'LOW', status: 'PENDING', notes: 'Need basic necessities', createdAt: '2024-07-05', allocatedResources: '' },
  { id: 6, userId: 3, userName: 'Priya Sharma', phone: '9876543212', disasterId: 1, disasterName: 'Kerala Floods 2024', location: 'Kochi, Kerala', familyMembers: 6, resourcesNeeded: 'Food, Tent, Medical Kit', priority: 'CRITICAL', status: 'REJECTED', notes: 'Duplicate request', createdAt: '2024-07-04', allocatedResources: '' },
  { id: 7, userId: 4, userName: 'Arun Verma', phone: '9876543213', disasterId: 5, disasterName: 'Tamil Nadu Drought', location: 'Madurai, Tamil Nadu', familyMembers: 8, resourcesNeeded: 'Water, Food', priority: 'HIGH', status: 'APPROVED', notes: 'Crops failed, family starving', createdAt: '2024-06-20', allocatedResources: 'Water x15, Rice x8' },
];

export const MOCK_DISTRIBUTION = [
  { id: 1, requestId: 1, requesterName: 'Rajesh Kumar', resourceId: 1, resourceName: 'Rice (50kg bags)', quantity: 5, distributionDate: '2024-07-02', deliveredBy: 'Admin User', location: 'Thrissur, Kerala' },
  { id: 2, requestId: 1, requesterName: 'Rajesh Kumar', resourceId: 3, resourceName: 'Drinking Water (20L)', quantity: 10, distributionDate: '2024-07-02', deliveredBy: 'Admin User', location: 'Thrissur, Kerala' },
  { id: 3, requestId: 2, requesterName: 'Priya Sharma', resourceId: 9, resourceName: 'Emergency Tents (Family)', quantity: 1, distributionDate: '2024-07-03', deliveredBy: 'Admin User', location: 'Bhubaneswar, Odisha' },
  { id: 4, requestId: 4, requesterName: 'Sunita Devi', resourceId: 4, resourceName: 'ORS Sachets', quantity: 20, distributionDate: '2024-06-27', deliveredBy: 'Admin User', location: 'Guwahati, Assam' },
  { id: 5, requestId: 7, requesterName: 'Arun Verma', resourceId: 3, resourceName: 'Drinking Water (20L)', quantity: 15, distributionDate: '2024-06-22', deliveredBy: 'Admin User', location: 'Madurai, Tamil Nadu' },
];

export const MOCK_AUDIT_LOGS = [
  { id: 1, admin: 'Admin User', action: 'APPROVE_REQUEST', entityType: 'ReliefRequest', entityId: 1, timestamp: '2024-07-02T10:30:00', details: 'Approved relief request for Rajesh Kumar' },
  { id: 2, admin: 'Admin User', action: 'CREATE_DISASTER', entityType: 'Disaster', entityId: 3, timestamp: '2024-08-02T09:15:00', details: 'Created disaster: Uttarakhand Landslide' },
  { id: 3, admin: 'Admin User', action: 'DISTRIBUTE_RESOURCE', entityType: 'Distribution', entityId: 3, timestamp: '2024-07-03T14:00:00', details: 'Distributed 1 tent to Priya Sharma' },
  { id: 4, admin: 'Admin User', action: 'REJECT_REQUEST', entityType: 'ReliefRequest', entityId: 6, timestamp: '2024-07-04T11:00:00', details: 'Rejected duplicate request from Priya Sharma' },
  { id: 5, admin: 'Admin User', action: 'UPDATE_RESOURCE', entityType: 'Resource', entityId: 9, timestamp: '2024-07-04T15:30:00', details: 'Updated Emergency Tents stock to 55' },
  { id: 6, admin: 'Admin User', action: 'APPROVE_REQUEST', entityType: 'ReliefRequest', entityId: 7, timestamp: '2024-06-21T08:45:00', details: 'Approved relief request for Arun Verma' },
];
