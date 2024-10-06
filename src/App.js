import React, { useState, useRef } from 'react';
import { Canvas, useFrame} from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';


// Función para convertir latitud y longitud a coordenadas cartesianas
const convertLatLngToXYZ = (lat, lng, radius) => {
  const latRad = (lat * Math.PI) / 180; // Convertimos a radianes
  const lngRad = (lng * Math.PI) / 180; // Convertimos a radianes

  const x = radius * Math.cos(latRad) * Math.cos(lngRad);
  const y = radius * Math.sin(latRad);
  const z = radius * Math.cos(latRad) * Math.sin(lngRad);
  
  return [x, y, z];
};

const Pin = ({ position, onClick }) => {
  const pinRef = useRef();

  // Usamos useFrame para hacer que el pin apunte al centro (0,0,0)
  useFrame(() => {
    if (pinRef.current) {
      pinRef.current.lookAt(0, -360, 0); // Orienta el pin hacia el centro de la esfera
    }
  });

  return (
    <mesh ref={pinRef} position={position} onClick={onClick}>
      <coneGeometry args={[0.025, 0.025, 100]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
};

// Componente del modelo 3D de la Tierra
function Tierra() {
  const { scene } = useGLTF('/tierra.glb'); // La ruta a tu modelo
  return <primitive object={scene} scale={[25, 25, 25]} />;
}

function App() {
  const [show, setShow] = useState(false);
  let textInfo="";
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Array de coordenadas geográficas (latitud, longitud)
  const geoCoordinates = [
    { lat:  -14.69271054185593, lng:  -68.35789610902172, info:"hola1"}, // segun pto, nos manda
    { lat: 50.10094593643655, lng: 73.51094429503554,info:"hola2" }, //bolivia 
   // { lat: 15.687360, lng: -96.351576 },// Ejemplo de coordenada geográfica
  ];

  const radius = 3.07; // Ajusta el radio de tu modelo de la tierra

  const handlePinClick = (info) => {
    textInfo=info
    console.log(info);
    setShow(true, info);
  };

  return (
    <div className="background">
      <video autoPlay loop muted>
        <source src="/fondo.mp4" type="video/mp4" />
      </video>

      <Canvas style={{ height: '100vh', width: '100vw' }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />
        
        {/* Renderizamos el modelo de la Tierra */}
        <Tierra />

        {/* Renderizamos los pines en las posiciones geográficas */}
        {geoCoordinates.map((coord, index) => {
          const lng = coord.lng<=0 ?coord.lng -47:coord.lng+47
         // console.log(coord);
          const position = convertLatLngToXYZ(coord.lat, lng , radius);
          return <Pin key={index} position={position} onClick={handlePinClick.bind(coord.info)} />;
        })}

        <OrbitControls 
          enableZoom={true} 
          minDistance={3.4} 
          maxDistance={10} 
          zoomSpeed={1.0} 
          target={[0, 0, 0]} 
        />
      </Canvas>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal de React-Bootstrap</Modal.Title>
        </Modal.Header>
        <Modal.Body>{textInfo} </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
      
    </div>
  );
}

// Estilos para el modal
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'white',
  padding: '20px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
};

export default App;