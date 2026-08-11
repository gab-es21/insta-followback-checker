import { ArrowLeftIcon } from './icons';

const STEPS = [
  {
    title: 'Open your data request',
    body: 'In the Instagram app or on instagram.com, go to Settings → Your Activity → Download Your Information.',
  },
  {
    title: 'Pick what to export',
    body: 'Choose "Some of your information", then select just Followers and following.',
  },
  {
    title: 'Choose JSON format',
    body: 'Set the export format to JSON, not HTML — FollowCheck can only read the JSON export.',
  },
  {
    title: 'Wait for the email',
    body: "Instagram emails you when the export is ready. Follow the link there to download it.",
  },
  {
    title: 'Drop it into FollowCheck',
    body: 'Upload the ZIP as-is, or just the loose following.json and followers_*.json files from connections/followers_and_following/.',
  },
];

export function HowToGuide({ onBack }: { onBack: () => void }) {
  return (
    <div className="how-to-guide">
      <button type="button" className="how-to-back" onClick={onBack}>
        <ArrowLeftIcon aria-hidden="true" />
        Back
      </button>
      <h2>How to get your Instagram data</h2>
      <p className="how-to-intro">
        Instagram doesn't offer live API access for this anymore — the only safe way to check who doesn't follow you
        back is through Instagram's own official data export. Here's how to request it.
      </p>
      <ol className="how-to-steps">
        {STEPS.map((step, index) => (
          <li key={step.title}>
            <span className="how-to-step-number" aria-hidden="true">
              {index + 1}
            </span>
            <div>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
