function actualizaCacheDinamico(dynamicCache,  req, res){
    if(res.ok){
        //Guardalo en la cache y además retornamelo
        return caches.open(dynamicCache).then( cache => {
            cache.put(req, res.clone());
            return res.clone();
        })
    } else {
        return res;
    }
}