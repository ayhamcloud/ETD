import nodeFetch from 'node-fetch';

jest.setTimeout(20000)

describe('test login endpoint', () => {

  it('unverified user ', async () => {
    const response = await nodeFetch('http://localhost:3000/api/users/login', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: "signup@gmail.com",
        password: "#a3456789"
      })
    });

    const data = await response.json();
    expect(response.status).toBe(403);
    expect(data).toStrictEqual({
      error: "Your Account is not verified - Please check your inbox",
    });
  })

  it('wrong password ', async () => {
    const response = await nodeFetch('http://localhost:3000/api/users/login', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: "login@example.com",
        password: "#a345689"
      })
    });

    const data = await response.json();
    expect(response.status).toBe(400);
    expect(data).toStrictEqual({ error: "Email or password is incorrect" });
  })

  it('verified user ', async () => {
    const response = await nodeFetch('http://localhost:3000/api/users/login', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: "login@example.com",
        password: "#a3456789"
      })
    });

    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data).toStrictEqual({ "loggedIn": true, "name": "login" });
  });
});