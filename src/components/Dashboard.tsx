const Dashboard = () => {
    const storedUserString = localStorage.getItem('user');
    var storedUser;
        // const temp=JSON.parse((localStorage.getItem('user'))?(localStorage.getItem('user')):"");
        if(storedUserString)
        {
            storedUser = JSON.parse(storedUserString);
        }
  return (
    <>
    <div>Dashboard</div>
    <p>{storedUser.username}</p>
    </> 
  )
}

export default Dashboard