<template>
  <section class="ct-bkg-container"></section> 
</template>

<script>
export default {
  name: 'Bkg'
}
</script>

<style>
.ct-bkg-container {
  position: fixed;
  z-index: -1;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: url(https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1553495737844&di=2a5c7efce254b6f91b0c256350af8fbb&imgtype=0&src=http%3A%2F%2Fwx4.sinaimg.cn%2Fcrop.0.0.2556.1440%2F6203a44dly1fxgxqbentlj21z4140k5p.jpg) no-repeat;
  background-size: cover;
  -webkit-filter: blur(10px);
       -moz-filter: blur(10px);
        -ms-filter: blur(10px);    
            filter: blur(10px); 
}
</style>