import React from 'react';
import { Link } from 'react-router-dom';
import { useStateContext } from '../utils/state';
import logo from '../img/ECN_Logo.png'
import { Button } from '@material-ui/core';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import { User } from '../models/User';


function Home() {
  const { state } = useStateContext();
  const fullname = (user: User) => {
    if(user)
      return `${user.firstname} ${user.lastname}`
    return ''
  }
  return (
    <div className="flex justify-center items-center h-screen w-screen bg-hero bg-cover">
      {!state.isAuthenticated && (
      <div className="flex-col w-6/12 h-auto justify-end items-center text-white text-center">
        <img className="w-2/4 mx-auto" src={logo} alt="Logo_ECN" />
        <h2 className="my-10 text-4xl">Bienvenue</h2>
        <p className=" my-10 text-base">Cet espace vous permettra d'assurer la meilleure gestion des emplois du temps à travers ses fonctionnalités et ses services</p>
        <Button variant="outlined" color="inherit" startIcon={<LockOpenIcon />}>
            <Link to="/login">Se connecter</Link>
        </Button>
      </div>
      )}
      {state.isAuthenticated && (
        <div className="flex-col w-6/12 h-auto justify-end items-center text-white text-center">
          <h2 className="my-10 text-4xl">Bonjour <span style={{ color: '#F9BE1B' }}>{fullname(state.user as User)}</span> !</h2>
          <p className=" my-10 text-2xl">Vous êtes connecté à votre espace</p>
        </div>
      )}
    </div>
  );
}

export default Home;
