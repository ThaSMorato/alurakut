import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';
import { AlurakutMenu, OrkutNostalgicIconSet } from '../src/components/lib/AlurakutCommons'

const ProfileSidebar = ({user}) => {
  return (
    <Box className="profileArea">
      <img style={{ borderRadius: "8px"}} src={`https://github.com/${user}.png`} />
    </Box>
  )
}

export default function Home() {

  const gitHubUser = "ThaSMorato";

  const pessoasFavoritas = [
    'juunegreiros',
    'peas',
    'omariosouto',
    'rafaballerini',
    'marcobrunodev',
    'felipefialho'
  ];

  return (
    <>
    <AlurakutMenu />
    <MainGrid>
      <div style={{ gridArea: "profileArea"}}>
        <ProfileSidebar user={gitHubUser} />
      </div>
      <div style={{ gridArea: "welcomeArea"}}>
        <Box className="welcomeArea">
          <h1 className="title">
            Bem Vindo(a)
            <OrkutNostalgicIconSet />
          </h1>
        </Box>
      </div>
      <div style={{ gridArea: "profileRelationsArea"}}>
        <ProfileRelationsBoxWrapper className="profileRelationsArea">
          <h2 className="smallTitle">
            Pessoas da Comunidade ({pessoasFavoritas.length})
          </h2>
          <ul>
            {
              pessoasFavoritas.map((pessoa) => {
                return (
                  <li>
                    <a href={`/users/${pessoa}`} key={pessoa}>  
                      <img src={`https://github.com/${pessoa}.png`} />
                      <span>{pessoa}</span>
                    </a>
                  </li>
                )
              })
            }
          </ul>
        </ProfileRelationsBoxWrapper>
        <Box>
          teste
        </Box>
      </div>
    </MainGrid>
    </>
  )
}
