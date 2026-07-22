export default function BadgeRequestButton({ badge, githubInfo }) {
  const { owner, repo } = githubInfo || {}

  if (!owner || !repo) {
    return (
      <p className="endorse-hint">
        Renseignez vos infos GitHub (owner/repo) pour activer la demande de badge.
      </p>
    )
  }

  const title = encodeURIComponent(`Demande de badge : ${badge.name}`)
  const body = encodeURIComponent(
    `Je souhaite obtenir le badge « ${badge.name} » (${badge.description}).\n\nContexte / justification :\n`
  )
  const url = `https://github.com/${owner}/${repo}/issues/new?title=${title}&body=${body}&labels=badge`

  return (
    <a className="endorse-btn" href={url} target="_blank" rel="noreferrer">
      ☆ Demander ce badge (GitHub)
    </a>
  )
}
