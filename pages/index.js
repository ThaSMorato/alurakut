import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import { useState, useEffect } from 'react';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';
import { AlurakutMenu, OrkutNostalgicIconSet, AlurakutProfileSidebarMenuDefault } from '../src/components/lib/AlurakutCommons';
import nookies from 'nookies';
import jwt from 'jsonwebtoken';

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

export default function Home({githubUser}) {

  const gitHubUser = githubUser;

  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  const [comunity, setCommunity] = useState([]);

  useEffect(async () => {
    const followersResponse = await fetch(`https://api.github.com/users/${gitHubUser}/followers`);
    const followersJson = await followersResponse.json();
    setFollowers(followersJson);
  }, [])

  useEffect(async () => {
    const followingResponse = await fetch(`https://api.github.com/users/${gitHubUser}/following`);
    const followingJson = await followingResponse.json();
    setFollowing(followingJson);
  }, [])

  useEffect(async () => {
    const comunityResponse = await fetch("https://graphql.datocms.com/", { 
      method: 'POST',
      headers: {
        'Authorization' : 'af23ab952f3c303eace91943a6eb2a',
        'Content-type' : 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({query: `query {
          allCommunities(
            filter: {
              creatorSlug: { eq: "${gitHubUser.toLocaleLowerCase()}"}
            }
          ) {
            id,
            creatorSlug,
            imageUrl,
            title
          }
        }`
      })
    });
    const comunityJson = await comunityResponse.json();
    handleCommunity(comunityJson.data.allCommunities)
  }, [])

  
  const handleCommunityCreate = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const name = formData.get('title');
    const url = formData.get('image');
    if((name != null || name != "") && (url != null || url != "")) {
      createCommunity(name, url);
    }
  }

  const createCommunity = async (name,url) => {
    const newComunityResponse = await fetch('/api/comunidades',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({title: name, imageUrl: url, creatorSlug: gitHubUser})
    })
    const newComunityJson = await newComunityResponse.json();
    const formatedCommunity = formatComunity(newComunityJson.newRegister);
    setCommunity([...comunity, formatedCommunity])
  }

  const handleCommunity = (communityArray) => {
    const formatedComunity = communityArray.map((community) => {
      return formatComunity(community)
    })
    setCommunity(formatedComunity);
  }

  const formatComunity = (community) => {
    return {
      id: community.id,
      login: community.title,
      avatar_url: community.imageUrl,
      url : `/comunity/${community.id}`
    }
  }

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

export async function getServerSideProps(context) {

  const cookies = nookies.get(context)
  const token = cookies.USER_TOKEN;
  
  const option =  {
    headers: {
        Authorization: token
    },
  };

  const ret = await fetch("https://alurakut.vercel.app/api/auth", option);

  const { isAuthenticated } = await ret.json();

  if(!isAuthenticated) {
    return { 
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }

  const { githubUser } = jwt.decode(token);

  return {
    props: {
      githubUser,
    }
  }
}