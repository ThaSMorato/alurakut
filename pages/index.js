import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import { useState } from 'react';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';
import { AlurakutMenu, OrkutNostalgicIconSet, AlurakutProfileSidebarMenuDefault } from '../src/components/lib/AlurakutCommons'

const ProfileSidebar = ({user}) => {
  return (
    <Box as="aside" className="profileArea">
      <img style={{ borderRadius: "8px"}} src={`https://github.com/${user}.png`} />
      <hr />
      <p>
        <a className="boxLink" href={`https://github.com/${user}`}>@{user}</a>
      </p>
      <hr />
      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

export default function Home() {

  const handleCommunityCreate = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const name = formData.get('title');
    const url = formData.get('image');
    if((name != null || name != "") && (url != null || url != "")) {
      createCommunity(name, url);
    }
  }

  const createCommunity = (name,url) => {
    setCommunity([...comunity, {id: new Date().toISOString(), name, url}])
  }

  const gitHubUser = "ThaSMorato";

  const [comunity, setCommunity] = useState([{
    id: new Date().toISOString(),
    name: "Eu Odeio Acordar Cedo",
    url: "https://alurakut.vercel.app/capa-comunidade-01.jpg"
  }]);

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
    <AlurakutMenu githubUser={gitHubUser} />
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
        <Box>
          <h2 className="subTitle" >O que voce deseja fazer?</h2>
          <form onSubmit={handleCommunityCreate}>
            <div>
              <input 
                placeholder="Qual vai ser o nome da sua comunidade?" 
                name="title"
                aria-label="Qual vai ser o nome da sua comunidade?"
                type="text"
              />
            </div>
            <div>
              <input 
                placeholder="Coloque uma url para usarmos de capa" 
                name="image"
                aria-label="Coloque uma url para usarmos de capa"
              />
            </div>
            <button
              type="submit"
            >
              Criar comunidade
            </button>
          </form>
        </Box>
      </div>
      <div style={{ gridArea: "profileRelationsArea"}}>
        <ProfileRelationsBoxWrapper className="profileRelationsArea">
          <h2 className="smallTitle">
            Pessoas da Comunidade ({pessoasFavoritas.length})
          </h2>
          <ul>
            {
              pessoasFavoritas.slice(0,6).map((pessoa) => {
                return (
                  <li key={pessoa}>
                    <a href={`/users/${pessoa}`}>  
                      <img src={`https://github.com/${pessoa}.png`} />
                      <span>{pessoa}</span>
                    </a>
                  </li>
                )
              })
            }
          </ul>
        </ProfileRelationsBoxWrapper>
        <ProfileRelationsBoxWrapper className="profileRelationsArea">
          <h2 className="smallTitle">
            Minhas Comunidades ({comunity.length})
          </h2>
          <ul>
            {
              comunity.slice(0,6).map((comunity) => {
                return (
                  <li key={comunity.id}>
                    <a href={`/users/${comunity.name}`}>  
                      <img src={comunity.url} />
                      <span>{comunity.name}</span>
                    </a>
                  </li>
                )
              })
            }
          </ul>
        </ProfileRelationsBoxWrapper>
      </div>
    </MainGrid>
    </>
  )
}
