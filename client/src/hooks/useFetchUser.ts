import { baseUrl, getRequest } from "../utils/services";
import { User } from "../types/auth";

const fetchUser = async (userId: string): Promise<User | null> => {
  try {
    const response = await getRequest(
      `${baseUrl}/users/find/${userId}`,
      undefined,
      true
    );
    return response;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export default fetchUser;
