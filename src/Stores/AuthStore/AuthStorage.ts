import * as Keychain from "react-native-keychain";


// =====================================
// TYPES
// =====================================

export interface AuthData {
  token: string;

  refreshToken: string;

  tokenExpiry: string;

  isLoginActive: boolean;

  loginTime: number;
}


// =====================================
// SAVE AUTH DATA
// =====================================

export const saveAuthData = async (
  response: {
    token: string;
    refreshToken: string;
    tokenExpiry: string;
  }
) => {

  const currentTime = Date.now();

  // check token already expired or not
  const expiryTime = new Date(response.tokenExpiry).getTime();

  const isActive = currentTime < expiryTime;

  const authData: AuthData = {
    token: response.token,

    refreshToken: response.refreshToken,

    tokenExpiry: response.tokenExpiry,

    isLoginActive: isActive,

    loginTime: currentTime,
  };

  console.log("Saved AuthData => ", authData);

  await Keychain.setGenericPassword(
    "auth",
    JSON.stringify(authData)
  );
};


// =====================================
// GET AUTH DATA
// =====================================

export const getAuthData = async (): Promise<AuthData | null> => {

  const credentials =
    await Keychain.getGenericPassword();

  if (!credentials?.password) {
    return null;
  }

  const authData: AuthData =
    JSON.parse(credentials.password);

  // =====================================
  // CHECK TOKEN EXPIRY
  // =====================================

  const currentTime = Date.now();

  const expiryTime =
    new Date(authData.tokenExpiry).getTime();

  const isActive =
    currentTime < expiryTime;

  authData.isLoginActive = isActive;

  return authData;
};


// =====================================
// GET ACCESS TOKEN
// =====================================

export const getAccessToken = async () => {

  const authData =
    await getAuthData();

  if (
    authData?.isLoginActive
  ) {
    return authData.token;
  }

  return null;
};


// =====================================
// CHECK LOGIN STATUS
// =====================================

export const isUserLoggedIn = async () => {

  const authData =
    await getAuthData();

  return authData?.isLoginActive || false;
};


// =====================================
// REMOVE AUTH DATA
// =====================================

export const removeAuthData = async () => {

  await Keychain.resetGenericPassword();
};