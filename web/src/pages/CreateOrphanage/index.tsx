import React, { useEffect, FormEvent, useState, ChangeEvent } from "react";
import { Map, Marker, TileLayer } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import { FiPlus } from "react-icons/fi";
import { useHistory } from "react-router-dom";

import Sidebar from "../../components/Sidebar";

import './style.css';
import mapIcon from "../../utils/mapIcon";
import api from "../../services/api";

const CreateOrphanage: React.FC = () => {
  const [ position, setPosition ] = useState({ latitude: 0, longitude: 0 });

  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [about, setAbout] = useState('');
  const [instructions, setInstructions] = useState('');
  const [opening_hours, setOpening_hours] = useState('');
  const [open_on_weekends, setOpen_on_weekends] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);

  const history = useHistory()

  useEffect(()=> {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;

      setInitialPosition([latitude, longitude]);
    })
  }, [])

  function handleMapClick(event: LeafletMouseEvent) {
    const { lat, lng } = event.latlng;
    
    setPosition({
      latitude: lat,
      longitude: lng
    });
  }

  function handleSelectImages(event: ChangeEvent<HTMLInputElement>) {
    if(!event.target.files) {
      return;
    }
    
    const selectedImages = Array.from(event.target.files)

    setImages(selectedImages);

    const selectedImagesPreview = selectedImages.map(image => {
      return URL.createObjectURL(image);
    });
    
    setPreviewImages(selectedImagesPreview);
  }

  async function handleFormSubmit(event: FormEvent) {
    event.preventDefault();

    const { latitude, longitude } = position;

    const data = new FormData();
    data.append('name', name);
    data.append('whatsapp', whatsapp);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    data.append('about', about);
    data.append('instructions', instructions);
    data.append('opening_hours', opening_hours);
    data.append('open_on_weekends', String(open_on_weekends));

    images.forEach(image => {
      data.append('images', image);
    })

    api
      .post('/orphanages', data)
      .then(response => {
        if(response.data.error){
          console.log(response.data.error)
        }
      })

    // alert('Cadastro realizado com sucesso!')
    // history.push('/app');
  }

  return (
    <div id="page-create-orphanage">
      <Sidebar />

      <main>
        <form className="create-orphanage-form" onSubmit={handleFormSubmit}>
          <fieldset>
            <legend>Dados</legend>

            <Map 
              center={initialPosition} 
              style={{ width: '100%', height: 280 }}
              zoom={15}
              onclick={handleMapClick}
            >
              <TileLayer 
                url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
              />

              {
                position.latitude !== 0 && (
                  <Marker 
                    interactive={false}
                    icon={mapIcon}
                    position={[position.latitude,position.longitude]} 
                  />
                )
              }
            </Map>

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input 
                id="name" 
                value={name}
                onChange={event => setName(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input 
                id="whatsapp" 
                value={whatsapp}
                onChange={event => setWhatsapp(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="about">Sobre <span>M??ximo de 300 caracteres</span></label>
              <textarea 
                id="name" 
                maxLength={300}
                value={about}
                onChange={event => setAbout(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>

              <div className="images-container">
                {
                  previewImages.map(image => (
                    <img key={image} src={image} alt={name} />
                  ))
                }

                <label htmlFor='image[]' className="new-image">
                  <FiPlus size={24} color="#15b6d6" />
                </label>
              </div>

              <input multiple onChange={handleSelectImages} type="file" id='image[]' />
            </div>
          </fieldset>

          <fieldset>
            <legend>Visita????o</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instru????es</label>
              <textarea 
                id="instructions"
                value={instructions}
                onChange={event => setInstructions(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Hor??rio de Funcionamento</label>
              <input 
                id="opening_hours"
                value={opening_hours}
                onChange={event => setOpening_hours(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button 
                  type="button"
                  className={open_on_weekends ? 'active' : ''}
                  onClick={() => setOpen_on_weekends(true)}
                >
                  Sim
                </button>
                <button 
                  type="button"
                  className={!open_on_weekends ? 'active' : ''}
                  onClick={() => setOpen_on_weekends(false)}
                >
                  N??o
                </button>
              </div>
            </div>
          </fieldset>

          <button className="confirm-button" type="submit">
            Confirmar
          </button>
        </form>
      </main>
    </div>
  );
}

export default CreateOrphanage;
