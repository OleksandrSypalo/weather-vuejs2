<template>
    <div class="navbar-shadow">
        <b-navbar toggleable="sm"
                  fixed="top"
                  type="dark"
                  text-variant="white"
                  variant="primary"
        >
            <b-container>
                <b-navbar-brand to="/">
                    <img src="@/assets/logo.png" alt="Logo"/>
                    <b>Forecast</b>
                </b-navbar-brand>
                <b-navbar-toggle target="nav_collapse"/>
                <b-collapse is-nav id="nav_collapse">
                    <b-navbar-nav class="ml-auto">
                        <b-nav-form v-on:submit.prevent="updateCity">
                            <b-input-group right="@">
                                <b-form-input type="text"
                                              placeholder="City or Zipcode"
                                              v-model="cityValue"
                                />
                            </b-input-group>
                        </b-nav-form>
                    </b-navbar-nav>
                </b-collapse>
            </b-container>
        </b-navbar>
    </div>
</template>

<script>
export default {
    name: 'Navbar',
    data() {
        return {
            cityValue: ''
        };
    },
    mounted(){
        this.cityValue = (this.$route.params.city || '')
    },
    methods: {
        updateCity() {
            this.$router.replace(`/${this.cityValue}`);
        }
    }
};
</script>

<style scoped>
.navbar-shadow {
    position: relative;
    height: 62px;
}

.navbar {
    box-shadow: 0 0 3px 2px #fff;
}
</style>
