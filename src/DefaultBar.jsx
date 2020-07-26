import React from 'react';
import './DefaultBar.css';

export default function DefaultBar({ scaled }) {

  return (
    <div
      className={
        scaled ? 'DefaultBar DefaultBar_scaled' : 'DefaultBar'
      }
    >
    </div>
  );
}
