import { useState } from 'react';
import { useRouter } from 'next/router';
import nookies from 'nookies';

const LoginScreen = () => {

    const router = useRouter();

    const [user, setUser] = useState("");

    const [isLoggin, setIsLoggin] = useState(false);

    const getToken = async () => {
        const option =  {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ githubUser: user})
        };

        const ret = await fetch("https://alurakut.vercel.app/api/login", option);
        const { token } = await ret.json();
        return token;
        
        
    }

    const checkIfUserExists = async () => {
        const userResponse = await fetch(`https://api.github.com/users/${user}`);
        const userJson = await userResponse.json();
        return !Object.keys(userJson).includes('message');
    }

    const handleSubmit = (token) => {

        nookies.set(null, 'USER_TOKEN', token, {
            path: '/',
            maxAge: 86400 * 7
        });

        router.push('/');
    }

    const handleAttemptToSubmit = async (e) => {
        e.preventDefault();
        setIsLoggin(true);
        const token = await getToken();
        if(await checkIfUserExists(token)) {
            handleSubmit(token);
        } else {
            alert("Not a github user")
        }
        setIsLoggin(false);
    }

  return (
    <main style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <div className="loginScreen">
        <section className="logoArea">
          <img src="https://alurakut.vercel.app/logo.svg" />

          <p><strong>Conecte-se</strong> aos seus amigos e familiares usando recados e mensagens instantâneas</p>
          <p><strong>Conheça</strong> novas pessoas através de amigos de seus amigos e comunidades</p>
          <p><strong>Compartilhe</strong> seus vídeos, fotos e paixões em um só lugar</p>
        </section>

        <section className="formArea">
          <form action="/" onSubmit={handleAttemptToSubmit} className="box">
            <p>
              Acesse agora mesmo com seu usuário do <strong>GitHub</strong>!
          </p>
            <input 
                placeholder="Usuário" 
                value={user} 
                onChange={e => setUser(e.target.value)} 
            />
            <button type="submit" disabled={isLoggin}>
              Login
            </button>
          </form>

          <footer className="box">
            <p>
              Ainda não é membro? <br />
              <a href="/login">
                <strong>
                  ENTRAR JÁ
              </strong>
              </a>
            </p>
          </footer>
        </section>

        <footer className="footerArea">
          <p>
            © 2021 alura.com.br - <a href="/">Sobre o Alurakut.br</a> - <a href="/">Centro de segurança</a> - <a href="/">Privacidade</a> - <a href="/">Termos</a> - <a href="/">Contato</a>
          </p>
        </footer>
      </div>
    </main>
  )
} 

export default LoginScreen;