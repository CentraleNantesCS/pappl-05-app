import React from 'react';
import { Link } from 'react-router-dom';
import { useStateContext } from '../utils/state';

function Home() {
  const { state } = useStateContext();

  let text = JSON.stringify(state);
  return (
    <div className="m-auto text-5xl font-bold">
      <Link to="/">PAPPL 05 {text}</Link>
    </div>
  );
}

export default Home;
