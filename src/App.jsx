function App() {
  const handleClick = () => {
    alert("🔥 It works!");
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">QPOS SaaS</h1>
      <Button onClick={handleClick}>Click me!</Button>
    </div>
  );
}
