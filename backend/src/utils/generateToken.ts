import jwt from "jsonwebtoken";

export function generateToken(
  userId: string,
  name: string,
  tokenVersion: number,
) {
  const accessToken = jwt.sign(
    {
      _id: userId,
      name,
      tokenVersion,
    },
    process.env.JWT_ACCESS_SECRET!,
    {
      expiresIn: "15m",
    },
  );

  const refreshToken = jwt.sign(
    {
      _id: userId,
      tokenVersion,
    },
    process.env.JWT_REFRESH_SECRET!,
    {
      expiresIn: "7d",
    },
  );

  return { accessToken, refreshToken };
}
