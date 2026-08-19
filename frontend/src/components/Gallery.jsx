import '../styles/Gallery.css'


function Gallery(){


const fotos = [

"https://images.unsplash.com/photo-1464226184884-fa280b87c399",

"https://images.unsplash.com/photo-1500937386664-56d1dfef3854",

"https://images.unsplash.com/photo-1498579397066-22750a3cb424",

"https://images.unsplash.com/photo-1461354464878-ad92f492a5a0"

]


return (

<section className="gallery">


<h2>
Fotos
</h2>


<div className="gallery-grid">


{
fotos.map((foto,index)=>(

<img

key={index}

src={foto}

alt={`Foto da estância ${index+1}`}

/>

))
}


</div>


</section>

)

}


export default Gallery