export default function EndorseButton({ project, githubInfo }) {
  const { owner, repo } = githubInfo || {}

  if (!owner || !repo) {
    return (
      <p className="endorse-hint">
        Le propriétaire de cette fiche doit renseigner ses infos GitHub (owner/repo) pour activer l'appui par les pairs.
      </p>
    )
  }

  const title = encodeURIComponent(`Appui pour le projet : ${project.name}`)
  const body = encodeURIComponent(
    `Je souhaite signaler mon appui pour le projet « ${project.name} » (id: ${project.id}).\n\nCe que j'apprécie / pourquoi je l'endosse :\n`
  )
  const url = `https://github.com/${owner}/${repo}/issues/new?title=${title}&body=${body}&labels=appui`

  return (
    <a className="endorse-btn" href={url} target="_blank" rel="noreferrer">
      ☆ Signaler un appui (GitHub)
    </a>
  )
}
