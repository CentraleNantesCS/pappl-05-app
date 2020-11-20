import React from 'react';
import { Link } from 'react-router-dom';
import { useStateContext } from '../utils/state';

function Home() {
  const { state } = useStateContext();

  return (
    <div className="m-auto text-5xl font-bold">
      <Link to="/">PAPPL 05</Link>
    </div>
  );
}

export default Home;
