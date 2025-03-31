import axios, { AxiosRequestConfig, Method, AxiosResponse } from "axios";
import { authenticator } from "otplib";
import NodeCache from "node-cache";
import { getCommonHeaders } from "./common-headers";
import {
  AngleOneGenerateTokenResponse,
  AngleOneTokenGenerateResponse,
} from "./types";
import { AngleOneErrorCodes } from "./error-codes";

const nodeCache = new NodeCache({ deleteOnExpire: false });

export class AngleOneAuthentication {
  /**
   * Generates a new session for the given private key.
   * @param {string} privateKey - The private key to use for authentication.
   * @returns {Promise<AngleOneGenerateSessionResponse>} A Promise that resolves to the session data.
   * @throws {Error} If the session data is not available.
   */
  public async generateSession(
    privateKey: string
  ): Promise<AngleOneTokenGenerateResponse> {
    const totp = authenticator.generate(process.env.ANGLE_ONE_TOTP as string);
    const data = JSON.stringify({
      clientcode: process.env.ANGLE_ONE_CLIENT_ID as string,
      password: process.env.ANGLE_ONE_PIN as string,
      totp,
    });

    const options: AxiosRequestConfig = {
      method: "POST" as Method,
      url: "https://apiconnect.angelbroking.com/rest/auth/angelbroking/user/v1/loginByPassword",
      headers: {
        ...getCommonHeaders(),
        "X-PrivateKey": privateKey,
      },
      data: data,
    };

    const response: AxiosResponse<AngleOneTokenGenerateResponse> = await axios(
      options
    );

    const session = response.data;
    if (!session.data) {
      throw new Error(AngleOneErrorCodes[session.errorcode]);
    }

    return session;
  }

  public async generateToken(): Promise<AngleOneGenerateTokenResponse> {
    const clientId = process.env.ANGLE_ONE_CLIENT_ID as string;
    const publisherApiKey = process.env.ANGLE_ONE_PUBLISHER_API_KEY as string;
    const token = this.getToken(clientId);
    const timeToLive = this.getTimeToLive(clientId);

    if (token && timeToLive) {
      return token;
    }

    const refreshToken = token?.refreshToken;

    if (!refreshToken) {
      const session = await this.generateSession(publisherApiKey);
      this.saveToken(clientId, session.data);
      return session.data;
    }

    const jwtToken = token?.jwtToken;
    const authToken = `Bearer ${jwtToken}`;

    const data = JSON.stringify({
      refreshToken,
    });

    const options: AxiosRequestConfig = {
      method: "POST" as Method,
      url: "https://apiconnect.angelbroking.com/rest/auth/angelbroking/jwt/v1/generateTokens",
      headers: {
        ...getCommonHeaders(),
        Authorization: authToken,
        "X-PrivateKey": publisherApiKey,
      },
      data: data,
    };

    const response: AxiosResponse<AngleOneTokenGenerateResponse> = await axios(
      options
    );

    const tokens = response.data;
    if (!tokens.data) {
      throw new Error(AngleOneErrorCodes[tokens.errorcode]);
    }

    this.saveToken(clientId, tokens.data);

    return tokens.data;
  }

  private saveToken(
    clientId: string,
    token: AngleOneGenerateTokenResponse,
    expirationInSeconds = 3600
  ) {
    nodeCache.set(clientId, token, expirationInSeconds);
  }

  private getToken(
    clientId: string
  ): AngleOneGenerateTokenResponse | undefined {
    return nodeCache.get(clientId);
  }

  private getTimeToLive(clientId: string): boolean {
    return nodeCache.ttl(clientId);
  }
}
