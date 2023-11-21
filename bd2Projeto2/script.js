document.addEventListener('DOMContentLoaded', async function() {
    const ocorrenciaList = document.getElementById('OcorrenciaList')

    const adicionarOcorrencia = async (ocorrencia) => {
        try {
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(ocorrencia)
            };
    
            const response = await fetch("http://localhost:3000/ocorrencias", options);
            const data = await response.json();
            console.log(data);
            
            await exibirOcorrencias();
        } catch (error) {
            console.error("Erro ao adicionar ocorrência:", error);
        }
    };
    
    const buscarOcorrencias = async () => {
        const response = await fetch("http://localhost:3000/ocorrencias");
        const data = await response.json();
        return data;
    }

    const deletarOcorrencia = async (ocorrenciaId) => {
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        }
    
        try {
            const response = await fetch(`http://localhost:3000/ocorrencias/${ocorrenciaId}`, options);
            const data = await response.json();
            console.log(data);
            await exibirOcorrencias();
        } catch (error) {
            console.error("Erro ao deletar ocorrência:", error);
        }
    }

    const editarOcorrencia = async (ocorrenciaId, dadosEditados) => {
        try {
            const options = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosEditados)
            };
    
            const response = await fetch(`http://localhost:3000/ocorrencias/${ocorrenciaId}`, options);
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Erro ao editar ocorrência:', error);
        }
        const ocorrenciasDoBanco = await buscarOcorrencias();

        if (ocorrenciasDoBanco.length > 0) {
        const ultimaOcorrencia = ocorrenciasDoBanco[ocorrenciasDoBanco.length - 1];
        await deletarOcorrencia(ultimaOcorrencia._id);
    }
    };


    const exibirOcorrencias = async () => {
        try {
            const ocorrenciasDoBanco = await buscarOcorrencias();
            const ocorrenciaHTML = ocorrenciasDoBanco.map((ocorrencia, index) => {
                const uniqueId = `mostradorDeLocal_${index}`;
                const deleteId = `deletarOcorrencia_${index}`;
                const editId = `editarOcorrencia_${index}`;

                const coordinates = ocorrencia.localizacao && ocorrencia.localizacao.coordinates
                ? ocorrencia.localizacao.coordinates
                : ['N/A', 'N/A'];

                return `
                    <div class="ocorrencia">
                        <p>Título: ${ocorrencia.titulo}</p>
                        <p>Tipo: ${ocorrencia.tipo}</p>
                        <p>Data e Hora: ${new Date(ocorrencia.data).toLocaleString()}</p>
                        <p>Latitude: ${coordinates[1]}</p>
                        <p>Longitude: ${coordinates[0]}</p>
                        <button id="${uniqueId}" class="mostradorDeLocal">Mostrar Local</button>
                        <button id="${deleteId}" class="deletarOcorrencia">Deletar</button>
                        <button id="${editId}" class="editarOcorrencia">Editar</button>
                    </div>
                `;
            });
        
            ocorrenciaList.innerHTML = '';
            ocorrenciaList.innerHTML += ocorrenciaHTML.join('');
        
            ocorrenciasDoBanco.map((ocorrencia, index) => {
                const uniqueId = `mostradorDeLocal_${index}`;
                const mostrarLocalBtn = document.getElementById(uniqueId);
                mostrarLocalBtn.addEventListener('click', () => {
                    if (ocorrencia.localizacao && ocorrencia.localizacao.coordinates) {
                        const lat = parseFloat(ocorrencia.localizacao.coordinates[1]);
                        const lng = parseFloat(ocorrencia.localizacao.coordinates[0]);
                        const position = { lat, lng };
                
                        map.panTo(position);
                        marcador.setLatLng(position);
                    } else {
                        console.error("Localização não disponível para esta ocorrência.");
                    }
                });
                
                const editId = `editarOcorrencia_${index}`;
                const editarButt = document.getElementById(editId);
                editarButt.addEventListener('click', () => {
                    abrirFormularioEdicao(ocorrencia);
                });
    
                const deleteId = `deletarOcorrencia_${index}`
                const deletarButt = document.getElementById(deleteId);
                deletarButt.addEventListener('click', async () => {
                    await deletarOcorrencia(ocorrencia._id);
                    await exibirOcorrencias();
                });
            });
        } catch (error) {
            console.error("Erro ao exibir ocorrências:", error);
        }
    };

    
    const form = document.getElementById('ocorrenciaForm');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const nomeOcorrencia = document.getElementById('nomeOcorrencia').value;
        const descricaoOcorrencia = document.getElementById('descricaoOcorrencia').value;
        const dataHoraOcorrencia = document.getElementById('dataHoraOcorrencia').value;
        const latitudeOcorrencia = parseFloat(document.getElementById('latitudeOcorrencia').value);
        const longitudeOcorrencia = parseFloat(document.getElementById('longitudeOcorrencia').value);

        const novaOcorrencia = {
            titulo: nomeOcorrencia,
            tipo: descricaoOcorrencia,
            data: dataHoraOcorrencia,
            localizacao: {
                type: 'Point',
                coordinates: [longitudeOcorrencia, latitudeOcorrencia]
            }
        };
        
        await adicionarOcorrencia(novaOcorrencia);

        document.getElementById('nomeOcorrencia').value = '';
        document.getElementById('descricaoOcorrencia').value = '';
        document.getElementById('dataHoraOcorrencia').value = '';
        document.getElementById('latitudeOcorrencia').value = '';
        document.getElementById('longitudeOcorrencia').value = '';

    });

    let map = L.map('mapDiv').setView([-6.889531952896556, -38.54527473449707], 17);
    let marcador = L.marker([-6.889531952896556, -38.54527473449707]).addTo(map);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    map.on('click', function(event) {
        const latlng = event.latlng;
        const latitude = latlng.lat;
        const longitude = latlng.lng;

        document.getElementById('latitudeOcorrencia').value = latitude;
        document.getElementById('longitudeOcorrencia').value = longitude;

        if(marcador) {
            marcador.setLatLng(latlng);
        } else {
            marcador = L.marker(latlng).addTo(map);
        }
        map.panTo(latlng);
    })

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        ttribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    await exibirOcorrencias();

    const abrirFormularioEdicao = async (ocorrencia) => {
        document.getElementById('nomeOcorrencia').value = ocorrencia.titulo;
        document.getElementById('descricaoOcorrencia').value = ocorrencia.tipo;
        document.getElementById('dataHoraOcorrencia').value = ocorrencia.data;
        document.getElementById('latitudeOcorrencia').value = ocorrencia.localizacao.coordinates[1];
        document.getElementById('longitudeOcorrencia').value = ocorrencia.localizacao.coordinates[0];

        const formEdicao = document.getElementById('ocorrenciaForm');
        
        formEdicao.removeEventListener('submit', adicionarOcorrencia);
        
        formEdicao.addEventListener('submit', async function(e) {
            e.preventDefault();
            const dadosEditados = {
                titulo: document.getElementById('nomeOcorrencia').value,
                tipo: document.getElementById('descricaoOcorrencia').value,
                data: document.getElementById('dataHoraOcorrencia').value,
                localizacao: {
                    type: 'Point',
                    coordinates: [
                        parseFloat(document.getElementById('longitudeOcorrencia').value),
                        parseFloat(document.getElementById('latitudeOcorrencia').value)
                    ]
                }
            };

            await editarOcorrencia(ocorrencia._id, dadosEditados);
            formEdicao.reset();
            formEdicao.removeEventListener('submit', editarOcorrencia);
            formEdicao.addEventListener('submit', adicionarOcorrencia);
            await exibirOcorrencias();
        });
    };

});