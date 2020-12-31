import React from 'react';
import { Link } from 'react-router-dom';
import { useStateContext } from '../utils/state';

function Home() {
  const { state } = useStateContext();

  return (
    <div className="m-auto text-5xl h-screen w-screen bg-hero bg-cover">
      <h1>Bonjour</h1>
    </div>
  );
}

export default Home;
