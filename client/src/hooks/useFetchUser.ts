/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseUrl, getRequest } from "../utils/services";

const fetchUser = async (userId: string): Promise<any | null> => {
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
