<template>
  <q-layout>
    <Header />
    <q-page-container class="q-ma-xl">
      <div class="page-title">Add Item</div>
      <q-form
        @submit="additem"
        class="q-gutter-md"
      >
        <q-select
          dense
          filled
          v-model="deptCode"
          use-input
          input-debounce="900"
          label="SELECT DEPARTMENT"
          hint="Required"
          :options="deptOptions"
          @filter="filterDept"
          emit-value
          map-options
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Select a department']"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-select
          dense
          filled
          v-model="categoryCode"
          use-input
          input-debounce="900"
          label="SELECT CATEGORY"
          hint="Required"
          :options="catOptions"
          @filter="filterCat"
          emit-value
          map-options
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Select a category']"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-input
          dense
          filled
          v-model.trim="itemCode"
          label="ITEM CODE"
          maxlength="6"
          counter
          hint="max 6 characters"
        />

        <q-input
          dense
          filled
          v-model.trim="receivingReport"
          label="RR NUMBER"
          maxlength="10"
          counter
          hint="max 10 characters"
        />

        <q-input
          dense
          filled
          v-model.trim="genericName"
          label="GENERIC NAME"
          hint="Required max 255 characters"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Type item name']"
          maxlength="255"
          counter
        />

        <!--
          hint="Required"
          lazy-rules
          :rules="[ val => val && val >= 1.00 || 'Enter an amount']"
        -->
        <q-input
          dense
          filled
          v-model="unitCost"
          label="UNIT COST (php)"
          prefix="₱"
          type="number"
          input-class="text-right"
          style="max-width: 200px"
          step="0.01"
          min="0"
          :rules="[ val => val && val >= 0 || 'Minimum of 0']"
        />

        <q-input
          dense
          v-model.number="itemQuantity"
          type="number"
          filled
          style="max-width: 200px"
          label="QUANTITY (pc/ pcs)"
          hint="Minimum 1 pc"
          input-class="text-right"
          lazy-rules
          :rules="[ val => val && val >= 1 || 'Minimum of 1 piece']"
          oninput="this.value = !!this.value && Math.abs(this.value) >= 1 ? Math.abs(this.value) : 1"
          min="1"
        />

        <q-input
          dense
          filled
          v-model="dateReceived"
          label="Date Received"
          type="date"
          style="max-width: 200px"
        />

        <q-select
          dense
          filled
          v-model="setNo"
          use-input
          input-debounce="900"
          label="Set No."
          :options="setIdOptions"
          @filter="filterSetId"
          style="max-width: 200px"
          emit-value
          map-options
          lazy-rules
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-input
          dense
          filled
          v-model.trim="supplierName"
          label="Supplier name"
          maxlength="255"
          counter
          hint="max 255 characters"
        />

        <q-input
          dense
          filled
          v-model.trim="purchaseOrderNo"
          label="PO number"
          maxlength="255"
          counter
          hint="max 255 characters"
        />

        <q-input
          dense
          filled
          v-model.trim="invoiceNo"
          label="Invoice number"
          maxlength="255"
          counter
          hint="max 255 characters"
        />

        <q-input
          dense
          filled
          v-model.trim="brandName"
          label="Brand"
          maxlength="255"
          counter
          hint="max 255 characters"
        />

        <q-input
          dense
          filled
          v-model.trim="brandModel"
          label="Model"
          maxlength="255"
          counter
          hint="max 255 characters"
        />

        <q-input
          dense
          filled
          v-model.trim="serialNo"
          label="Serial number"
          maxlength="255"
          counter
          hint="max 255 characters"
        />

        <q-input
          dense
          filled
          v-model.trim="itemSpecs"
          label="Specification"
          maxlength="1000"
          counter
          hint="max 1000 characters"
        />

        <q-input
          dense
          filled
          v-model.trim="newAssetCode"
          label="New Asset Code"
          maxlength="255"
          counter
          hint="max 255 characters"
        />

        <div class="q-gutter-sm flex items-center ats-checkbox">
          <q-checkbox
            v-model="tagStatus"
            color="primary"
            label="Asset Tag Status: "
            true-value="Tagged"
            false-value="Untagged"
            style="margin: 0;"
          />
          <strong style="padding-bottom: 7px;">'{{ tagStatus }}'</strong>
        </div>

        <q-input
          dense
          filled
          v-model.trim="itemRemarks"
          label="Remarks"
          maxlength="255"
          counter
          hint="max 255 characters"
        />

        <q-input
          dense
          filled
          v-model.trim="oldAssetCode"
          label="Old asset code"
          maxlength="255"
          counter
          hint="max 255 characters"
        />

        <q-input
          dense
          filled
          v-model="physicalLocation"
          label="Physical location"
          maxlength="255"
          counter
          hint="max 255 characters"
        />

        <div class="row justify-center">
          <q-btn :loading="loading" label="Add Item to Inventory" type="submit" color="primary" style="width: 40%;"/>
        </div>
      </q-form>

      <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[18, 18]">
        <q-btn fab icon="keyboard_arrow_up" color="blue-grey-12" />
      </q-page-scroller>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue';
import { mapState } from 'vuex';
import axios from 'axios';
import fetchSelect from 'src/helpers/fetchSelect';
import Header from '../components/Header.vue';
import setToken from 'src/helpers/setToken';

export default defineComponent ({
  components: {
    Header,
  },
  data() {
    return {
      loading: false,
      url: `${process.env.API_HOST}/api/additem`,
      deptUrl: `${process.env.API_HOST}/api/getDept`,
      categoryUrl: `${process.env.API_HOST}/api/getCategory`,
      setListUrl: `${process.env.API_HOST}/api/getSetNo`,

      token: setToken().token,
      user: setToken().user,
      rights: setToken().rights,

      deptList: null,
      deptOptions: this.deptList,

      catList: null,
      catOptions: this.catList,

      deptCode: null,
      categoryCode: null,

      genericName: '',
      unitCost: '0',
      itemQuantity: 1,
      dateReceived: '',
      setNo: null,
      supplierName: '',
      purchaseOrderNo: '',
      invoiceNo: '',
      brandName: '',
      brandModel: '',
      serialNo: '',
      itemSpecs: '',
      newAssetCode: '',
      tagStatus: 'Untagged',
      itemRemarks: '',
      oldAssetCode: '',
      physicalLocation: '',
      itemCode: '',
      receivingReport: '',

      setIdList: null,
      setIdOptions: this.setIdList,
    }
  },
  computed: {
    ...mapState([
      'departments',
      'categories',
    ]),
  },
  methods: {
    warning(text, color) {
      this.$q.notify(
        {
          color: color,
          textColor: 'white',
          icon: 'warning',
          message: text,
        }
      );
    },
    additem: async function() {
      this.loading = true;
      const addItemUrl = this.url;
      const token = this.token;

      const dataArray = {
        deptCode: this.deptCode,
        categoryCode: this.categoryCode,
        genericName: this.genericName,
        unitCost: this.unitCost,
        itemQuantity: this.itemQuantity,
        dateReceived: this.dateReceived,
        setNo: this.setNo,
        supplierName: this.supplierName,
        purchaseOrderNo: this.purchaseOrderNo,
        invoiceNo: this.invoiceNo,
        brandName: this.brandName,
        brandModel: this.brandModel,
        serialNo: this.serialNo,
        itemSpecs: this.itemSpecs,
        newAssetCode: this.newAssetCode,
        assetTagStatus: this.tagStatus,
        itemRemarks: this.itemRemarks,
        oldAssetCode: this.oldAssetCode,
        physicalLocation: this.physicalLocation,
        itemCode: this.itemCode,
        receivingReport: this.receivingReport,
      }

      if (dataArray.assetTagStatus == 'Tagged') {
        dataArray.assetTagStatus = '1';
      } else if (dataArray.assetTagStatus == 'Untagged') {
        dataArray.assetTagStatus = '0';
      }

      // remove empty string fields
      let postObject = Object.fromEntries(Object.entries(dataArray).filter(([_, v]) => v !== ''));

      await axios.post(`${addItemUrl}`, { postObject }, { headers: {"Authorization" : `Bearer ${token}`} })
      .then(res => {
        if(res.status === 200) {
          this.warning('Item Added', 'green-5');
        } else {
          this.warning('Failed to add item', 'red-5');
        }
      })
      .catch(err => {
        if(err.message === 'Network Error') {
          this.warning('Network Error', 'red-5');
        } else {
          this.warning('Error', 'red-5');
        }
      })
      .finally(() => {
        setTimeout(() => {
          this.loading = false;
        }, 900);
      })
    },
    filterDept (val, update) {
      if (val === '') {
        update(() => {
          this.deptOptions = this.deptList
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.deptOptions = this.deptList.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
      })
    },
    filterCat (val, update) {
      if (val === '') {
        update(() => {
          this.catOptions = this.catList
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.catOptions = this.catList.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
      })
    },
    async fetchSetList() {
      this.setIdList = await fetchSelect.setIdList(this.setListUrl, this.token)
    },
    filterSetId (val, update) {
      if (val === '') {
        update(() => {
          this.setIdOptions = this.setIdList
        })
        return
      }

      update(() => {
        const needle = val.toString().toLowerCase()
        this.setIdOptions = this.setIdList.filter(v => v.label.toString().toLowerCase().indexOf(needle) > -1)
      })
    },
  },
  async mounted() {
    this.deptList = await this.departments;
    this.catList = await this.categories;
    await this.fetchSetList();
  },
  watch: {
    departments: function(value) {
      this.deptList = value;
    },
    categories: function(value) {
      this.catList = value;
    },
  }
})
</script>

<style scoped>

</style>
