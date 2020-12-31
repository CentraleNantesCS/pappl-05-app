import React from 'react';
import { Link } from 'react-router-dom';
import Front from '../components/front';
import { useStateContext } from '../utils/state';

function Home() {
  const { state } = useStateContext();

  return (
    <div className="m-auto text-5xl h-screen w-screen bg-hero bg-cover">
      <h1>Welcome</h1>
    </div>
  );
}

export default Home;
