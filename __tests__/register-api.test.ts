import nodeFetch from 'node-fetch';
import { PrismaClient } from "@prisma/client";

describe('test signup endpoint ', () => {
  it('short password ', async () => {
    const response = await nodeFetch('http://localhost:3000/api/users/signup', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: "kahles17",
        email: "simon.roehrl01@gmail.com",
        password: "#SC"
      })
    });

    const data = await response.json();
    expect(data).toStrictEqual({ "error": "Password must be at least 8 characters long" });
    expect(response.status).toBe(400);
  });

  it('valid signup', async () => {

    const prisma = new PrismaClient();
    try {
      await prisma.user.delete({
        where: {
          email: "simon.roehrl01@gmail.com"
        }
      })
    }
    catch (err) {
      console.log(err)
    }

    const response = await nodeFetch('http://localhost:3000/api/users/signup', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: "kahles17",
        email: "simon.roehrl01@gmail.com",
        password: "#SCt3PfGSW"
      })
    });

    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.user.email).toStrictEqual("simon.roehrl01@gmail.com");
  });
});