export const jwtConstants = {
  get secret() {
    const secret = process.env.JWT_SECRET;
    if (!secret && process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET is not defined in the environment variables!');
    }
    return secret || 'devSecretKeyDoNotUseInProd';
  },
};
