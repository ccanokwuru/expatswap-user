import { useEffect, useState } from "react";
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

type UserFilters = {
  by?: keyof User;
  dir?: "asc" | "desc";
  from?: string;
  to?: string;
  page?: number;
};
export const Index = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [sortField, setSortField] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleSort = (field: keyof User) => {
    let sortedUsers = [...users];
    if (sortField === field) {
      sortedUsers.reverse();
    } else {
      sortedUsers.sort((a, b) => {
        const aValue = a[field];
        const bValue = b[field];
        if (typeof aValue === "string" && typeof bValue === "string") {
          return aValue.localeCompare(bValue);
        } else {
          return aValue - bValue;
        }
      });
    }
    setSortField(field);
    setUsers(sortedUsers);
  };

  const handleDateFilter = () => {
    let filteredUsers = users;
    if (startDate) {
      filteredUsers = filteredUsers.filter(
        (user) => new Date(user.dob!) >= startDate
      );
    }
    if (endDate) {
      filteredUsers = filteredUsers.filter(
        (user) => new Date(user.dob!) <= endDate
      );
    }
    setUsers(filteredUsers);
  };
  function getUsers(input?: UserFilters) {
    const { page, from, to, by, dir } = input;
    fetch(
      `${API_URL}?page=${page ?? 1}&from=${from}&to=${to}&by=${by}&dir=${dir}`
    )
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }
  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
      <div className="flex flex-col">
        <div className="flex">
          <input
            className="border rounded p-2 mr-2"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.valueAsDate)}
          />
          <input
            className="border rounded p-2 mr-2"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.valueAsDate)}
          />
          <button
            className="bg-blue-500 text-white rounded p-2"
            onClick={handleDateFilter}
          >
            Filter
          </button>
        </div>

        <table className="border-collapse">
          <thead>
            <tr>
              <th className="border p-2" onClick={() => handleSort("id")}>
                ID
              </th>
              <th className="border p-2" onClick={() => handleSort("email")}>
                Email
              </th>
              <th className="border p-2" onClick={() => handleSort("password")}>
                Password
              </th>
              <th className="border p-2" onClick={() => handleSort("username")}>
                Username
              </th>
              <th className="border p-2" onClick={() => handleSort("phone")}>
                Phone
              </th>
              <th className="border p-2" onClick={() => handleSort("address")}>
                Address
              </th>
              <th
                className="border p-2"
                onClick={() => handleSort("firstName")}
              >
                First Name
              </th>
              <th className="border p-2" onClick={() => handleSort("lastName")}>
                Last Name
              </th>
              <th className="border p-2" onClick={() => handleSort("dob")}>
                Date of Birth
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="border p-2">{user.id}</td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2">{user.password}</td>
                <td className="border p-2">{user.username}</td>
                <td className="border p-2">{user.phone}</td>
                <td className="border p-2">{user.address}</td>
                <td className="border p-2">{user.firstName}</td>
                <td className="border p-2">{user.lastName}</td>
                <td className="border p-2">{user.dob}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
