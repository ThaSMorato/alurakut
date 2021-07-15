import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import { useState, useEffect } from 'react';
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

const ProfileRelationsBox = ({ title, itens }) => {
  return (
    <ProfileRelationsBoxWrapper className="profileRelationsArea">
          <h2 className="smallTitle">
            { title } ({itens.length})
          </h2>
          <ul>
            {
              itens.slice(0,6).map((follower) => {
                return (
                  <li key={follower.id}>
                    <a href={follower.url}>  
                      <img src={follower.avatar_url} />
                      <span>{follower.login}</span>
                    </a>
                  </li>
                )
              })
            }
          </ul>
        </ProfileRelationsBoxWrapper>
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
    const id = new Date().toISOString();
    setCommunity([...comunity, {id, login: name, avatar_url: url, url : `/comunity/${id}`}])
  }

  const gitHubUser = "ThaSMorato";

  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  useEffect(async () => {
    const followersResponse = await fetch(`https://api.github.com/users/${gitHubUser}/followers`);
    const followersJson = await followersResponse.json();
    console.log(followersJson);
    setFollowers(followersJson);
  }, [])

  useEffect(async () => {
    const followingResponse = await fetch(`https://api.github.com/users/${gitHubUser}/following`);
    const followingJson = await followingResponse.json();
    console.log(followingJson);
    setFollowing(followingJson);
  }, [])

  const [comunity, setCommunity] = useState([{
    id: new Date().toISOString(),
    login: "Eu Odeio Acordar Cedo",
    avatar_url: "https://alurakut.vercel.app/capa-comunidade-01.jpg",
    url: "/comunitty/Eu Odeio Acordar Cedo"
  }]);


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
        <ProfileRelationsBox title="Meus Seguidores" itens={followers} />
        <ProfileRelationsBox title="Quem eu Sigo" itens={following} />
        <ProfileRelationsBox title="Minhas Comunidades" itens={comunity} />
      </div>
    </MainGrid>
    </>
  )
}
