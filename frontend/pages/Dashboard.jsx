import useAuth from "../auth/useAuth";

function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-container">
      <h1>Welcome, {user?.username}</h1>

      <button onClick={logout}>Logout</button>

      <p>This is your HabitClock dashboard.</p>
    </div>
  );
}

export default Dashboard;
