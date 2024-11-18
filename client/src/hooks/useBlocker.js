import { useEffect } from "react";
import React from "react";
import { UNSAFE_NavigationContext as NavigationContext } from "react-router-dom";

export function useBlocker(blocker, when = true) {
  const { navigator } = React.useContext(NavigationContext);

  // Suponha que você tenha um estado para controlar se há uma venda em aberto
  const vendaEmAberto = true; // Aqui, substitua pelo seu estado real

  useEffect(() => {
    if (!when || !vendaEmAberto) return;

    const { push, replace } = navigator;

    const autoUnblock = () => {
      navigator.push = push;
      navigator.replace = replace;
      navigator.block = null;
    };

    navigator.block = (tx) => {
      blocker({
        ...tx,
        retry() {
          autoUnblock();
          tx.retry();
        },
      });
    };

    return () => {
      autoUnblock();
    };
  }, [navigator, blocker, when, vendaEmAberto]);
}
