import logo from "@assets/img/logo.svg";
import "@src/styles/index.css";
import styles from "./Newtab.module.css";
import {createEffect, createSignal} from "solid-js";

const Newtab = () => {
  const [history, setHistory] = createSignal([]);

  const getHistoryData = async () => {
    const data = await chrome.storage.local.get(["history"]);
    return data?.history ?? [];
  }

  createEffect(async () => {
    const data = await getHistoryData();
    setHistory(data)
  })

  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <img src={logo} class={styles.logo} alt="logo" />
        <p class="font-bold">
          Edit <code>src/pages/history/Newtab.tsx</code> and save to reload.
        </p>
        <code style={{"font-size": "12px"}}>
          {history().length}
        </code>
      </header>
    </div>
  );
};

export default Newtab;
