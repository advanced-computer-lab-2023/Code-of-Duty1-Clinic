import { login, register } from '../../services';
import { StatusCodes } from 'http-status-codes';
import { HttpError } from '../../utils';
import { User } from '../../models';
import { generateFakeUser } from '../fakeData/generate';
async function generateUser(role: string) {
  const user = await generateFakeUser(role);
  // console.log("-----------------");
  //  console.log((user as any));
  // console.log("-----------------");

  // (user as any).role = role;
  return user as any;
}
describe('Testing Auth endpoint', () => {
  describe('Testing Register', () => {
    it('Register as valid doctor', async () => {
      const user = await generateUser('Doctor');
      const res = await register(user);
      expect(res.status).toBe(StatusCodes.CREATED);
      expect(res.message).toBe('User created successfully');
      expect(res.result).toBeInstanceOf(User);
    });
    it('Register as valid patient', async () => {
      const user = await generateUser('Patient');
      const res = await register(user);
      expect(res.status).toBe(StatusCodes.CREATED);
      expect(res.message).toBe('User created successfully');
      expect(res.result).toBeInstanceOf(User);
    });
    it('Register as user with invalid role', async () => {
      const user = await generateUser('Doctor');
      user.role = 'A';
      await expect(register(user)).rejects.toThrow('Role is not correct');
    });
  });
});
