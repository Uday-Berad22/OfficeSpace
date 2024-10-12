import { ObjectId } from 'mongodb'
import { getDatabase } from '@/lib/database';

interface User {
  _id: ObjectId;
  name: string;
  tokens: number;
  status: string;
  parking_allotment: string;
}

interface Allocation {
  name: string;
  
}

export async function allocateParking(): Promise<Allocation[]> {
  const db = await getDatabase();
  const users = await db.collection('users').find({}).toArray() as User[];
  
  const selectedIds = selectIds(users, 8);
  const allocations = await updateAllocationStatus(selectedIds);
  return allocations;
}

function selectIds(users: User[], numToSelect: number): ObjectId[] {
  users.sort((a, b) => a.tokens - b.tokens);
  
  const groups: { [key: number]: ObjectId[] } = {};
  for (const { _id, tokens } of users) {
    if (!groups[tokens]) {
      groups[tokens] = [];
    }
    groups[tokens].push(_id);
  }
  
  const selectedIds: ObjectId[] = [];
  const tokenCounts = Object.keys(groups).map(Number).sort((a, b) => a - b);
  
  for (const tokenCount of tokenCounts) {
    const group = groups[tokenCount];
    if (group.length + selectedIds.length <= numToSelect) {
      selectedIds.push(...group);
    } else {
      const remaining = numToSelect - selectedIds.length;
      const shuffled = group.sort(() => 0.5 - Math.random());
      selectedIds.push(...shuffled.slice(0, remaining));
    }
    if (selectedIds.length === numToSelect) {
      break;
    }
  }
  
  return selectedIds;
}

async function updateAllocationStatus(selectedIds: ObjectId[]): Promise<Allocation[]> {
  const db = await getDatabase();
  
  // Update selected users' status and increment their tokens
  await db.collection("users").updateMany(
    { _id: { $in: selectedIds } },
    { 
      $set: { status: "allotted" },
      $inc: { tokens: 1 }
    }
  );

  // Fetch and return the updated allocations
  const allocations = await db.collection("users").find(
    { _id: { $in: selectedIds } }
  ).project({ name: 1, parkingSpot: 1, _id: 0 }).toArray() as Allocation[];

  return allocations;
}
