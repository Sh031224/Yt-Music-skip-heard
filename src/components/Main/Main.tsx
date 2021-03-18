import React from "react";
import "./Main.scss";

interface MainProps {}

const Main = ({}: MainProps) => {
  return (
    <>
      <main>
        <article>
          <h2>Automatically skip songs you've heard in YouTube Music.</h2>
          <p>Do not do anything while adjusting the playlist.</p>
        </article>
      </main>
    </>
  );
};

export default Main;
