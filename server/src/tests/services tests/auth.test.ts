import { login, register } from '../../services';
import { StatusCodes } from 'http-status-codes';
import { HttpError } from '../../utils';
import { User } from '../../models';
import { generateFakeUser } from '../fakeData/generate';
const password = 'password';
const users: Record<string, any[]> = {
  Patient: [],
  Doctor: [],
  Admin: []
};
const logedInUsersToken = [];
async function generateUser(role: string, saveIt: boolean = false) {
  const user = await generateFakeUser(role);
  user.password = password;
  if (saveIt) users[role].push(user as any);
  return user as any;
}
function printUsers() {
  Object.keys(users).forEach((role) => {
    console.log(`Role: ${role}`);
    console.log(users[role]);
  });
}
describe('Testing Auth', () => {
  describe('Testing Register', () => {
    it('Register as valid doctor', async () => {
      const user = await generateUser('Doctor');
      const res = await register(user);
      users['Doctor'].push(res.result as any);

      expect(res.status).toBe(StatusCodes.CREATED);
      expect(res.message).toBe('User created successfully');
      expect(res.result).toBeInstanceOf(User);
    });
    it('Register as valid patient', async () => {
      const user = await generateUser('Patient');
      const res = await register(user);
      users['Patient'].push(res.result as any);
      expect(res.status).toBe(StatusCodes.CREATED);
      expect(res.message).toBe('User created successfully');
      expect(res.result).toBeInstanceOf(User);
    });
    it('Register as Admin', async () => {
      const user = await generateUser('Admin');
      const res = await register(user);
      users['Admin'].push(res.result as any);
      expect(res.status).toBe(StatusCodes.CREATED);
      expect(res.message).toBe('User created successfully');
      expect(res.result).toBeInstanceOf(User);
    });

    it('Register as user with invalid role', async () => {
      const user = await generateUser('Doctor');
      user.role = 'A';
      await expect(register(user)).rejects.toThrow('Role is not correct');
      printUsers();
    });
  });

  describe('Testing Login', () => {
    describe('Login as invalid user', () => {
      it('login with no username and no password', async () => {
        await expect(login({})).rejects.toThrow('Username and password are required');
      });
      it('Login with invalid username', async () => {
        await expect(login({ username: '0no_existence0', password: 'password' })).rejects.toThrow('User not found');
      });
      it('Login with valid username and invalid password', async () => {
        await expect(login({ username: users['Patient'][0].username, password: '47851' })).rejects.toThrow(
          'Incorrect password'
        );
        await expect(login({ username: users['Patient'][0].username, password: '' })).rejects.toThrow(
          'Username and password are required'
        );
      });
    });
    it('Login as  valid user', async () => {
      const userArrays = Object.values(users);
      for (let i = 0; i < userArrays.length; i++) {
        for (let j = 0; j < userArrays[i].length; j++) {
          const res = await login({ username: userArrays[i][j].username, password: password });
          expect(res.status).toBe(StatusCodes.OK);
          expect(res.message).toBe('Login successful');
          expect(res.token).toBeDefined();
          logedInUsersToken.push(res.token);
        }
      }
    });
  });
});
