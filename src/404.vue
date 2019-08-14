<template>
    <div>
        <b-container>
            <b-jumbotron lead="I think I lost it in that stack of papers down there..." header="Page not found...">
                <b-img src="https://cdn.discordapp.com/attachments/351163208918237195/610949243498266624/paper-clutter.png" fluid alt="Look at this wonderfully organized stack of papers.  Isn't it great?"></b-img>

                <p>But, I know how to get us back home.</p>
                <b-button to="/">Take me home.</b-button>
            </b-jumbotron>

            <h1>What the heck just happened?</h1>
            <p>Either you tried to access a part of the app's interface that doesn't exist, or you tried to access a resource (project, user, task, etc.) that doesn't exist or that you aren't allowed to see.  In either case, it resulted in this page showing up because Michael's a... decent... programmer?</p>
        </b-container>
    </div>
</template>

<script>
export default {
  name: 'teapot',
};
</script>
