import api from './api';

class App {
    constructor(){
        this.repositories = [];
        this.formEL = document.getElementById('repo-form');
        this.listEL = document.getElementById('repo-list');
        this.inputEL = document.querySelector('input[name=repository]');
        this.registerHandlers();
    }

    registerHandlers(){
        this.formEL.onsubmit = event => this.addRepository(event);
    }

    async addRepository(event){
        event.preventDefault();

        const repoInput = this.inputEL.value;
        if (repoInput.length ===0) {
            return;
        }

        try {

            this.setLoading();

            const response = await api.get(`/repos/${repoInput}`);            
            const {name, description, html_url, owner: {avatar_url}} = response.data;

            this.repositories.push({
                name,
                description,
                avatar_url,
                html_url,
            });

            this.inputEL.value = '';
            this.render();

        } catch (error) {
            this.renderError();
        }
       
        this.setLoading(false);
    }

    setLoading(loading = true){
        if (loading === true){
            let loadingEL = document.createElement('span');
            loadingEL.appendChild(document.createTextNode('Carregando...'));
            loadingEL.setAttribute('id','loading');

            this.formEL.appendChild(loadingEL);
        }else{
            document.getElementById('loading').remove();
        }
    }    

    renderError(){
        
        if (document.getElementById('error') != null){
            document.getElementById('error').remove();
        }

        let errorEL = document.createElement('span');
        errorEL.appendChild(document.createTextNode('Repositório Não Existe!'));
        errorEL.setAttribute('id','error');
        this.formEL.appendChild(errorEL);
    }

    render(){        
        
        this.listEL.innerHTML = '';
        if (document.getElementById('error') != null){
            document.getElementById('error').remove();
        }

        this.repositories.forEach(element => {
            let imgEL = document.createElement('img');
            imgEL.setAttribute('src',element.avatar_url);

            let titleEL = document.createElement('strong');
            titleEL.appendChild(document.createTextNode(element.name));

            let descriptionEL = document.createElement('p');
            descriptionEL.appendChild(document.createTextNode(element.description));

            let linkEL = document.createElement('a');
            linkEL.setAttribute('target','_blank');
            linkEL.setAttribute('href',element.html_url);
            linkEL.appendChild(document.createTextNode('Acessar'));

            let listItemEL = document.createElement('li');
            listItemEL.appendChild(imgEL);
            listItemEL.appendChild(titleEL);
            listItemEL.appendChild(descriptionEL);
            listItemEL.appendChild(linkEL);

            this.listEL.appendChild(listItemEL);
        }); 
    }
}

new App();