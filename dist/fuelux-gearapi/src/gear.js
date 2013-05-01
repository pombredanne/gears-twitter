(function(root, factory){
    if(typeof define === 'function' && define.amd) {
        define(['postmonger'], function(Postmonger){ factory(root, Postmonger); });
    }else {
        factory(root, root.Postmonger);
    }
}(this, function(root, Postmonger){
    root.FUELUX_EDITOR = new Postmonger.Session();
    return root.FUELUX_EDITOR;
}));