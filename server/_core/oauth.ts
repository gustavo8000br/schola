import { Express } from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma"; // ajuste se seu prisma estiver em outro caminho

export function registerOAuthRoutes(app: Express) {
  const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    process.env.GOOGLE_REDIRECT_URL! // exemplo: http://localhost:3000/api/oauth/callback
  );

  // URL para iniciar o login
  app.get("/api/oauth/google", (req, res) => {
    const url = client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: ["email", "profile"],
    });

    res.redirect(url);
  });

  // Callback do Google
  app.get("/api/oauth/callback", async (req, res) => {
    try {
      const code = req.query.code as string;

      if (!code) return res.status(400).send("Código não informado.");

      // troca código por token
      const { tokens } = await client.getToken(code);
      client.setCredentials(tokens);

      // valida ID Token
      const ticket = await client.verifyIdToken({
        idToken: tokens.id_token!,
        audience: process.env.GOOGLE_CLIENT_ID!,
      });

      const payload = ticket.getPayload();

      if (!payload?.email) {
        return res.status(400).send("Não foi possível obter os dados do Google");
      }

      // busca ou cria usuário
      let user = await prisma.user.findUnique({
        where: { email: payload.email },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email: payload.email,
            name: payload.name ?? "Usuário",
            avatar: payload.picture ?? "",
            googleId: payload.sub,
            role: "student",
          },
        });
      }

      // cria token JWT
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
      );

      // salva token como cookie httpOnly
      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      });

      // redireciona pro front
      res.redirect(process.env.FRONTEND_URL + "/auth/callback?ok=1");

    } catch (err) {
      console.error("OAuth callback error:", err);
      res.status(500).send("Erro no login com o Google.");
    }
  });
}
