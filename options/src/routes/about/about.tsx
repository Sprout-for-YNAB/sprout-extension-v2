import styles from "./about.module.css";
import { getNamespace } from "@shared/utils/extensionApi";

export default function About() {
  const { name, author, version, homepage_url } = getNamespace().runtime.getManifest();

  return (
    <section>
      <h2>About</h2>
      <p>Version {version}</p>
      <p>YNAB is a trademark of You Need A Budget LLC. {name} is not affiliated with YNAB.</p>
      <p>&copy; 2021-2024 {author}</p>
      <ul>
        <li className={styles.link}>
          <a href={`${homepage_url}/updates`} id="updates-link" target="_blank">
            Update History
          </a>
        </li>
        <li className={styles.link}>
          <a href={`${homepage_url}/licenses`} id="licenses-link" target="_blank">
            Licenses
          </a>
        </li>
        <li className={styles.link}>
          <a href={`${homepage_url}/privacy`} id="privacy-link" target="_blank">
            Privacy Policy
          </a>
        </li>
      </ul>
    </section>
  );
}
