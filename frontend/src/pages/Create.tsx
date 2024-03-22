import React, { useState } from "react";
import { API_URL } from "../constants";

type User = {
  email: string;
  password: string;
  id?: number;
  username?: string;
  phone?: string;
  address?: string;
  firstName?: string;
  lastName?: string;
  dob?: string;
};

export const Create = () => {
  const [user, setUser] = useState<User>({
    email: "",
    password: "",
    username: undefined,
    phone: undefined,
    address: undefined,
    firstName: undefined,
    lastName: undefined,
    dob: undefined,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        // redirect or display success message
      } else {
        // display error message
      }
    } catch (error) {
      // handle error
    }
  };

  return (
    // This page allows users to create a new user account by submitting a form with the user's email, password, and optional additional profile information. The form data is sent to the API to create the new user account.

    <form onSubmit={handleSubmit} className="space-y-4">
      <label>
        Email:
        <input
          type="email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          className="border border-gray-400 p-2 rounded-md"
          placeholder="Enter email"
        />
      </label>

      <label>
        Password:
        <input
          type="password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          className="border border-gray-400 p-2 rounded-md"
          placeholder="Enter password"
        />
      </label>

      <label>
        Username:
        <input
          type="text"
          value={user.username}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
          className="border border-gray-400 p-2 rounded-md"
          placeholder="Enter username"
        />
      </label>

      <label>
        Phone:
        <input
          type="text"
          value={user.phone}
          onChange={(e) => setUser({ ...user, phone: e.target.value })}
          className="border border-gray-400 p-2 rounded-md"
          placeholder="Enter phone"
        />
      </label>

      <label>
        Address:
        <input
          type="text"
          value={user.address}
          onChange={(e) => setUser({ ...user, address: e.target.value })}
          className="border border-gray-400 p-2 rounded-md"
          placeholder="Enter address"
        />
      </label>

      <label>
        First Name:
        <input
          type="text"
          value={user.firstName}
          onChange={(e) => setUser({ ...user, firstName: e.target.value })}
          className="border border-gray-400 p-2 rounded-md"
          placeholder="Enter first name"
        />
      </label>

      <label>
        Last Name:
        <input
          type="text"
          value={user.lastName}
          onChange={(e) => setUser({ ...user, lastName: e.target.value })}
          className="border border-gray-400 p-2 rounded-md"
          placeholder="Enter last name"
        />
      </label>

      <label>
        Date of Birth:
        <input
          type="date"
          value={user.dob}
          onChange={(e) => setUser({ ...user, dob: e.target.value })}
          className="border border-gray-400 p-2 rounded-md"
        />
      </label>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Create User
      </button>
    </form>
  );
};
