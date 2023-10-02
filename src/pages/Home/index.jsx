import { useState, useEffect } from 'react';
import { FiPlus } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom';
import { Container, Brand, Menu, Search, Content, NewNote } from './styles';

import { Header } from '../../components/Header';
import { Input } from '../../components/Input';
import { Note } from '../../components/Note';
import { Section } from '../../components/Section';
import { ButtonText } from '../../components/ButtonText';
import { api } from '../../services/api';

export function Home() {

  const [tags, setTags] = useState([]);
  const [tagsSelected, setTagsSelected] = useState([]);
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();


  function handleTagSelected(tagName) {

    if(tagName === "all"){
      return setTagsSelected([]);
    }

    const alreadySelected = tagsSelected.includes(tagName);

    if(alreadySelected){
      const filteredTags = tagsSelected.filter(tag => tag !== tagName);
      setTagsSelected(filteredTags);
    } else {
      setTagsSelected(prevState => [...prevState, tagName]);
    }
  }

  function handleDatails(id) {
    console.log("navigate funcionando")
    navigate(`/details/${id}`);
  }

  useEffect(() => {
    async function fetchTags() {
      const response = await api.get("/tags");
      setTags(response.data);
      
      console.log(response.data);
    }

    fetchTags();
  }, [])

  useEffect(() => {
    async function fetchNotes() {
      const response = await api.get(`/notes?title=${search}&tags=${tagsSelected}`);
      setNotes(response.data);
      
      console.log(response.data);
    }

    fetchNotes();
  }, [tagsSelected, search])

  return (
    <Container>
      <Brand>
        <h1>Rocketnotes</h1>
      </Brand>

      <Header />

      <Menu>
        <li><ButtonText title="Todos" 
          $isActive={tagsSelected.length === 0} 
          onClick={() => handleTagSelected("all")}
          /></li>
        {
          tags && tags.map(tag => (
            
            <li key={String(tag.id)}>
              <ButtonText 
              title={tag.name} 
              onClick={() => handleTagSelected(tag.name)}
              $isActive={tagsSelected.includes(tag.name)}
              />
            </li>
          ))
        }
      </Menu>

      <Search>
        <Input 
          placeholder="Pesquisar pelo titulo" 
          onChange={(e) => setSearch(e.target.value)}
          />
      </Search>

      <Content>
        <Section title="Minhas notas">
          {
            notes.map(note => (
            <Note
              key={String(note.id)}
              data={note}
              onClick={() => handleDatails(note.id)}
              />
            ))
          } 
        </Section>
      </Content>

      <NewNote to="/new">
        <FiPlus />
        Criar nota
      </NewNote>
    </Container>
  );
}